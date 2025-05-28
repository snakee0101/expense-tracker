<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Actions\SavingsPlans\CreateSavingsTransactionAction;
use App\Actions\SavingsPlans\DeductFromBalanceAction;
use App\Http\Requests\SavingsPlans\CreateSavingsPlanRequest;
use App\Http\Requests\SavingsPlans\CreateTransactionRequest;
use App\Http\Requests\SavingsPlans\UpdateSavingsPlanRequest;
use App\Models\SavingsPlan;
use App\Queries\SavingsPlans\SavingsChartDataQuery;
use App\Queries\SavingsPlans\TotalSavingsGainQuery;
use Inertia\Inertia;

class SavingsPlanController extends Controller
{
    public function index()
    {
        return Inertia::render('savings_plans', [
            'savings_plans' => SavingsPlan::where('user_id', auth()->id())
                ->latest()
                ->get(),
            'relatedAccounts' => app()->call(AccountsList::class, ['checkForExpiryDate' => true]),
            'total_savings_gain' => app()->call(TotalSavingsGainQuery::class),
            'savingsChartData' => app()->call(SavingsChartDataQuery::class),
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
