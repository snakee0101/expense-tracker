<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SavingsPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

        $relatedAccounts->push(...Card::where('user_id', auth()->id())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance
            ];
        }));

        return Inertia::render('savings_plans', [
            'savings_plans' => SavingsPlan::where('user_id', auth()->id())
                ->latest()
                ->get(),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())->latest()->get(),
            'relatedAccounts' => $relatedAccounts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('cards')->where('user_id', auth()->id())
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SavingsPlan $savingsPlan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SavingsPlan $savingsPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SavingsPlan $savingsPlan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SavingsPlan $savingsPlan)
    {
        //
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

        //create a transaction
        Transaction::create([
            'name' => $request->name,
            'date' => Carbon::parse("{$request->date} {$request->time}"),
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            $relatedModelIdField => $request->related_account_id,
            $relatedModelTypeField => $request->related_account_type,
            $savingsPlanIdField => $request->savings_plan_id,
            $savingsPlanTypeField => SavingsPlan::class,
        ]);

        //change balance of savings plan
        $savingsPlan = SavingsPlan::findOrFail($request->savings_plan_id);
        $savingsPlan->increment('balance', $request->amount * ($request->boolean('is_withdraw') ? -1 : 1));

        //change balance of wallet/card
        $account = ($request->related_account_type)::findOrFail($request->related_account_id);
        $account->increment('balance', $request->amount * ($request->boolean('is_withdraw') ? 1 : -1));

        return to_route('savings_plan.index');
    }
}
