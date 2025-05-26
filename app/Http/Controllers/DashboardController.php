<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\SavingsPlan;
use App\Models\SpendingLimit;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Queries\Dashboard\CashflowQuery;
use App\Queries\Dashboard\ExpenseBreakdownQuery;
use App\Queries\Dashboard\IncomeExpenseStatisticsQuery;
use App\Queries\Dashboard\RecentTransactionsQuery;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        //Expense breakdown
        if (Cache::has('expenseBreakdownDateRangeStart')) {
            $expenseBreakdownStartingDate = $request->has('expenseBreakdownDateRangeStart') ? Carbon::parse($request->expenseBreakdownDateRangeStart) : Carbon::parse(Cache::get('expenseBreakdownDateRangeStart'));
            $expenseBreakdownEndingDate = $request->has('expenseBreakdownDateRangeEnd') ? Carbon::parse($request->expenseBreakdownDateRangeEnd) : Carbon::parse(Cache::get('expenseBreakdownDateRangeEnd'));
        } else {
            $expenseBreakdownStartingDate = $request->has('expenseBreakdownDateRangeStart') ? Carbon::parse($request->expenseBreakdownDateRangeStart) : now()->subMonth();
            $expenseBreakdownEndingDate = $request->has('expenseBreakdownDateRangeEnd') ? Carbon::parse($request->expenseBreakdownDateRangeEnd) : now();
        }

        Cache::delete('expenseBreakdownDateRangeStart');
        Cache::delete('expenseBreakdownDateRangeEnd');

        Cache::rememberForever('expenseBreakdownDateRangeStart', fn () => $expenseBreakdownStartingDate->format('Y-m-d H:i:s'));
        Cache::rememberForever('expenseBreakdownDateRangeEnd', fn () => $expenseBreakdownEndingDate->format('Y-m-d H:i:s'));

        $savingsPlans = SavingsPlan::where('user_id', auth()->id())
                                    ->latest()
                                    ->get();

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
