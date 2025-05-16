<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\SpendingLimit;

function fillMissingMonths(array $data): array
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
            // Normalize nulls to 0.00 as strings
            $entry['expense'] = $entry['expense'] ?? "0.00";
            $entry['income'] = $entry['income'] ?? "0.00";
        } else {
            $entry = [
                'month' => $month,
                'expense' => "0.00",
                'income' => "0.00"
            ];
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
                                                 WHEN destination_type = ? THEN amount
                                            END
                                      ) AS amount_spent',
            [
                Wallet::class, Card::class,
                Contact::class
            ])
            ->where('user_id', auth()->id())
            ->where('status', TransactionStatus::Completed)
            ->whereBetween('date', [$expenseBreakdownStartingDate, $expenseBreakdownEndingDate])
            ->groupBy('category_id')
            ->get();


        //Cashflow
        $cashflow = Transaction::selectRaw('SUM(
                                            CASE
                                                 WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN amount
                                                 WHEN destination_type = ? THEN -amount
                                            END
                                      ) AS expense',
                [
                    Wallet::class, Card::class,
                    Contact::class
                ])
            ->selectRaw('SUM(
                                            CASE
                                                 WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount > 0 THEN amount
                                            END
                                      ) AS income',
                [
                    Wallet::class, Card::class
                ])
            ->selectRaw("DATE_FORMAT(date, '%b') AS month")
            ->where('user_id', auth()->id())
            ->where('status', TransactionStatus::Completed)
            ->whereBetween('date', [now()->startOfYear()->setTime(0,0,0), now()->endOfYear()->setTime(23,59,59)])
            ->groupByRaw("DATE_FORMAT(date, '%b'), MONTH(date)")
            ->orderByRaw("MONTH(date)")
            ->get()
            ->toArray();

        //Accounts
        $accounts = Wallet::where('user_id', auth()->id())->get()->map(function (Wallet $wallet) {
            return [
                'id' => $wallet->id,
                'type' => 'wallet',
                'name' => $wallet->name,
                'balance' => $wallet->balance,
                'card_number' => null
            ];
        });

        $accounts->push(...Card::where('user_id', auth()->id())->whereDate('expiry_date', '>=', now())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => 'card',
                'name' => $card->name,
                'balance' => $card->balance,
                'card_number' => $card->card_number
            ];
        }));

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit,
            'amountSpent' => $spendingLimit->amountSpent(),
            'expenseBreakdown' => $expenseBreakdown,
            'expenseBreakdownStartingDate' => $expenseBreakdownStartingDate,
            'expenseBreakdownEndingDate' => $expenseBreakdownEndingDate,
            'cashflow' => fillMissingMonths($cashflow),
            'accounts' => $accounts
        ]);
    }
}
