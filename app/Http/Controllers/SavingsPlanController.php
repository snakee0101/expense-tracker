<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Actions\SavingsPlans\CreateSavingsTransactionAction;
use App\Actions\SavingsPlans\DeductFromBalanceAction;
use App\Enums\TransactionStatus;
use App\Http\Requests\SavingsPlans\CreateSavingsPlanRequest;
use App\Http\Requests\SavingsPlans\CreateTransactionRequest;
use App\Http\Requests\SavingsPlans\UpdateSavingsPlanRequest;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Queries\SavingsPlans\TotalSavingsGainQuery;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

function fillMissingMonthsForEachSavingsPlan($chartData) {

    $groupedBySavingsPlan = collect($chartData)->groupBy('savings_plan_id')->toArray();

    foreach ($groupedBySavingsPlan as $savingsPlanId => $savingsPlanChart) {
        for($month = 1; $month < 13; $month++) {
            if (empty(array_filter($savingsPlanChart, function ($chartItem) use ($month) {
                return $chartItem['month'] == $month;
            }, ARRAY_FILTER_USE_BOTH)) === true) { //if chart data doesn't contain data for specific month - fill it with value for previous month (since this is accumulation chart)

                $closestMonth = $month - 1;
                $closestMonthBalance = null;

                while($closestMonth > 0) {
                    $closestMonthBalance = array_filter($savingsPlanChart, function ($chartItem) use ($closestMonth) {
                        return $chartItem['month'] == $closestMonth;
                    });

                    if(!empty($closestMonthBalance)) {
                        $closestMonthBalance = array_values($closestMonthBalance);
                        $closestMonthBalance = $closestMonthBalance[0]['savings_plan_balance'];
                        break;
                    }

                    $closestMonth--;
                }

                if($closestMonthBalance == []) {
                    $closestMonthBalance = null;
                }

                $groupedBySavingsPlan[$savingsPlanId][] = [
                   'month' => $month,
                   'savings_plan_id' => $savingsPlanId,
                   'savings_plan_balance' => $month > now()->month ? null : $closestMonthBalance //data for future months is unknown - it must be filled with nulls
                ];
            }
        }
    }

    return $groupedBySavingsPlan;
}

class SavingsPlanController extends Controller
{
    public function index()
    {
        //get data for savings chart
        $savingsQuery = "SUM(
                             CASE
                                WHEN destination_type = ? THEN amount
                                WHEN source_type = ? THEN -amount
                                ELSE 0
                             END
                        )";

        DB::statement("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"); //can't partition by destination when this mode is turned on

        $savingsChartData = Transaction::query()
            ->selectRaw('MONTH(date) as month')
            ->selectRaw('CASE
                                        WHEN destination_type = ? THEN destination_id
                                        WHEN source_type = ? THEN source_id
                                   END AS savings_plan_id', [SavingsPlan::class, SavingsPlan::class])
            ->selectRaw(
                "ROUND(
                    SUM($savingsQuery) OVER (PARTITION BY IF(destination_type = ?, destination_id, source_id) ORDER BY DATE_FORMAT(date, '%Y-%m'))
                , 2) AS savings_plan_balance",
                [
                    SavingsPlan::class, SavingsPlan::class, SavingsPlan::class
                ]
            )
            ->where('user_id', auth()->id())
            ->where('status', TransactionStatus::Completed)
            ->whereRaw("YEAR(date) = YEAR(CURDATE())")
            ->where('date', '<', now())
            ->where(function($q) {
                $q->where('source_type', SavingsPlan::class)
                    ->orWhere('destination_type', SavingsPlan::class);
            })
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m'), month, savings_plan_id")
            ->get()
            ->toArray();

        DB::statement("SET sql_mode=(SELECT CONCAT(@@sql_mode, ',ONLY_FULL_GROUP_BY'));");

        return Inertia::render('savings_plans', [
            'savings_plans' => SavingsPlan::where('user_id', auth()->id())
                ->latest()
                ->get(),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())->latest()->get(),
            'relatedAccounts' => app()->call(AccountsList::class, ['checkForExpiryDate' => true]),
            'total_savings_gain' => app()->call(TotalSavingsGainQuery::class),
            'savingsChartData' => fillMissingMonthsForEachSavingsPlan($savingsChartData),
            'transactionStatusList' => TransactionStatus::toSelectOptions()
        ]);
    }

    public function store(CreateSavingsPlanRequest $request)
    {
        SavingsPlan::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'target_balance' => $request->target_balance,
            'due_date' => $request->due_date,
            'savings_tips' => $request->savings_tips
        ]);

        return to_route('savings_plan.index');
    }

    public function update(UpdateSavingsPlanRequest $request, SavingsPlan $savings_plan)
    {
        $savings_plan->update([
            'name' => $request->name,
            'target_balance' => $request->target_balance,
            'due_date' => $request->due_date,
            'savings_tips' => $request->savings_tips
        ]);

        return to_route('savings_plan.index');
    }

    public function transaction(CreateTransactionRequest $request)
    {
        $transaction = app()->call(CreateSavingsTransactionAction::class, ['request' => $request]);

        app()->call(DeductFromBalanceAction::class, ['transaction' => $transaction, 'request' => $request]);

        return to_route('savings_plan.index');
    }
}
