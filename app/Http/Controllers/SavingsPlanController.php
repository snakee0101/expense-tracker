<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSavingsBalance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SavingsPlanController extends Controller
{
    public function index()
    {
        $relatedAccounts = Wallet::where('user_id', auth()->id())->get()->map(function (Wallet $wallet) {
            return [
                'id' => $wallet->id,
                'type' => Wallet::class,
                'name' => $wallet->name,
                'balance' => $wallet->balance
            ];
        });

        $relatedAccounts->push(...Card::where('user_id', auth()->id())->whereDate('expiry_date', '>=', now())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance
            ];
        }));

        $total_savings_gain = Transaction::selectRaw( //formula:  100% * (current month total - previous month total) / (previous month total)
                "ROUND( 100 * (
                    SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END )
                  - LAG(SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END )) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                 ) / (
                    LAG(SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END )) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                 ), 2) AS monthly_diff",
                [SavingsPlan::class, SavingsPlan::class, SavingsPlan::class]
            ) //if money is transferred TO savings plan, then the sign is "+", otherwise its "-";
                ->selectRaw("DATE_FORMAT(date, '%Y-%m') AS month")
                ->where('user_id', auth()->id())
                ->where(function($q) {
                    $q->where('source_type', SavingsPlan::class)
                      ->orWhere('destination_type', SavingsPlan::class);
                })
                ->whereDate('date', '<=', now())
                ->whereRaw("DATE_FORMAT(date, '%Y-%m') IN (
                    DATE_FORMAT(CURDATE(), '%Y-%m'),
                    DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
                )") //include statistics for current and previous month only
                ->where('status', TransactionStatus::Completed)
                ->groupByRaw("DATE_FORMAT(date, '%Y-%m')")
                ->get()
                ->sum('monthly_diff');

        return Inertia::render('savings_plans', [
            'savings_plans' => SavingsPlan::where('user_id', auth()->id())
                ->latest()
                ->get(),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())->latest()->get(),
            'relatedAccounts' => $relatedAccounts,
            'total_savings_gain' => $total_savings_gain
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('savings_plans')
                    ->where('user_id', auth()->id())
            ],
            'target_balance' => ['required', 'numeric', 'gt:0'],
            'due_date' => ['required', 'date-format:Y-m-d H:i:s'],
            'savings_tips' => ['nullable']
        ]);

        SavingsPlan::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return to_route('savings_plan.index');
    }

    public function update(Request $request, SavingsPlan $savings_plan)
    {
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('savings_plans')
                    ->where('user_id', auth()->id())
                    ->ignoreModel($savings_plan)
            ],
            'target_balance' => ['required', 'numeric', 'gt:0'],
            'due_date' => ['required', 'date-format:Y-m-d H:i:s'],
            'savings_tips' => ['nullable']
        ]);

        $savings_plan->update($validated);

        return to_route('savings_plan.index');
    }


    public function transaction(Request $request)
    {
        //if we want to withdraw from savings plan to a card or wallet
        if ($request->boolean('is_withdraw')) {
            $relatedModelIdField = 'destination_id';
            $relatedModelTypeField = 'destination_type';
            $savingsPlanIdField = 'source_id';
            $savingsPlanTypeField = 'source_type';
        } else {
            $relatedModelIdField = 'source_id';
            $relatedModelTypeField = 'source_type';
            $savingsPlanIdField = 'destination_id';
            $savingsPlanTypeField = 'destination_type';
        }

        $account = ($request->related_account_type)::findOrFail($request->related_account_id);

        $savingsPlan = SavingsPlan::find($request->savings_plan_id);

        $request->validate([
            'card' => new CheckCardExpiration($account),
            'amount' => new WithinSavingsBalance($savingsPlan, $request->amount * ($request->boolean('is_withdraw') ? -1 : 1))
        ]);

        //create a transaction
        $transactionDate = Carbon::parse("{$request->date} {$request->time}");
        Transaction::create([
            'name' => $request->name,
            'date' => $transactionDate,
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            $relatedModelIdField => $request->related_account_id,
            $relatedModelTypeField => $request->related_account_type,
            $savingsPlanIdField => $request->savings_plan_id,
            $savingsPlanTypeField => SavingsPlan::class,
            'status' => $transactionDate->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);

        if ($transactionDate->isNowOrPast()) {
            //change balance of savings plan
            $savingsPlan = SavingsPlan::findOrFail($request->savings_plan_id);
            $savingsPlan->increment('balance', $request->amount * ($request->boolean('is_withdraw') ? -1 : 1));

            //change balance of wallet/card
            $account->increment('balance', $request->amount * ($request->boolean('is_withdraw') ? 1 : -1));
        }

        return to_route('savings_plan.index');
    }
}
