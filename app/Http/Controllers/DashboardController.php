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
use App\Queries\Dashboard\IncomeExpenseStatisticsQuery;
use App\Queries\Dashboard\RecentTransactionsQuery;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

function fillMissingMonths(array $data, array $columns): array
{
    $allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $indexedData = [];

    // Re-index existing data by month name
    foreach ($data as $item) {
        $indexedData[$item['month']] = $item;
    }

    // Fill in missing months
    $result = [];
    foreach ($allMonths as $month) {
        if (isset($indexedData[$month])) {
            $entry = $indexedData[$month];

            foreach ($columns as $column => $defaultValue) {
                $entry[$column] = $entry[$column] ?? $defaultValue;
            }
        } else {
            $entry = ['month' => $month];

            foreach ($columns as $column => $defaultValue) {
                $entry[$column] = $entry[$column] ?? $defaultValue;
            }
        }
        $result[] = $entry;
    }

    return $result;
}

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        //Expense breakdown
        //TODO: Error expense breakdown is not recognized on the frontend
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

        $expenseBreakdown = Transaction::with('category')
            ->selectRaw('category_id, SUM(
                                            CASE
                                                 WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN -amount
                                                 WHEN destination_type IN (?, ?) THEN amount
                                            END
                                      ) AS amount_spent',
            [
                Wallet::class, Card::class,
                Contact::class, Payment::class

            ])
            ->where('user_id', auth()->id())
            ->where('status', TransactionStatus::Completed)
            ->whereBetween('date', [$expenseBreakdownStartingDate, $expenseBreakdownEndingDate])
            ->groupBy('category_id')
            ->get();

        //Savings plans
        $savingsPlans = SavingsPlan::where('user_id', auth()->id())
                                    ->latest()
                                    ->get();

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit,
            'amountSpent' => $spendingLimit->amountSpent(),
            'expenseBreakdown' => $expenseBreakdown,
            'expenseBreakdownStartingDate' => $expenseBreakdownStartingDate,
            'expenseBreakdownEndingDate' => $expenseBreakdownEndingDate,
            'cashflow' => fillMissingMonths(app()->call(CashflowQuery::class)->get()->toArray(), ['expense' => 0, 'income' => 0]),
            'accounts' => app()->call(AccountsList::class, ['checkForExpiryDate' => true]),
            'savingsPlans' => $savingsPlans,
            'recentTransactions' => app()->call(RecentTransactionsQuery::class)->get()->toArray(),
            'transactionStatusList' => TransactionStatus::toSelectOptions(),
            'incomeExpenseStatistics' => app()->call(IncomeExpenseStatisticsQuery::class)->get()->toArray()
        ]);
    }
}
