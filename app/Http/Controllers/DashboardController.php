<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Actions\Dashboard\ExpenseBreakdownDateRange;
use App\Enums\TransactionStatus;
use App\Models\SavingsPlan;
use App\Models\SpendingLimit;
use App\Queries\Dashboard\CashflowQuery;
use App\Queries\Dashboard\ExpenseBreakdownQuery;
use App\Queries\Dashboard\IncomeExpenseStatisticsQuery;
use App\Queries\Dashboard\RecentTransactionsQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $savingsPlans = SavingsPlan::where('user_id', auth()->id())
                                    ->latest()
                                    ->get();

        [$expenseBreakdownStartingDate, $expenseBreakdownEndingDate] = app()->call(ExpenseBreakdownDateRange::class);

        $expenseBreakdown = app()->call(ExpenseBreakdownQuery::class, [
            'expenseBreakdownStartingDate' => $expenseBreakdownStartingDate,
            'expenseBreakdownEndingDate' => $expenseBreakdownEndingDate
        ])->get();

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id()),
            'amountSpent' => $spendingLimit->amountSpent(),
            'expenseBreakdown' => $expenseBreakdown,
            'expenseBreakdownStartingDate' => $expenseBreakdownStartingDate,
            'expenseBreakdownEndingDate' => $expenseBreakdownEndingDate,
            'cashflow' => app()->call(CashflowQuery::class),
            'accounts' => app()->call(AccountsList::class, ['checkForExpiryDate' => true]),
            'savingsPlans' => $savingsPlans,
            'recentTransactions' => app()->call(RecentTransactionsQuery::class)->get()->toArray(),
            'transactionStatusList' => TransactionStatus::toSelectOptions(),
            'incomeExpenseStatistics' => app()->call(IncomeExpenseStatisticsQuery::class)->get()->toArray()
        ]);
    }
}
