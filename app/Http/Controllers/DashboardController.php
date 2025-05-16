<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\Wallet;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\SpendingLimit;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        $expenseBreakdownStartingDate = $request->has('expenseBreakdownDateRangeStart') ? Carbon::parse($request->expenseBreakdownDateRangeStart) : now()->subMonth();
        $expenseBreakdownEndingDate = $request->has('expenseBreakdownDateRangeEnd') ? Carbon::parse($request->expenseBreakdownDateRangeEnd) : now();

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

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit,
            'amountSpent' => $spendingLimit->amountSpent(),
            'expenseBreakdown' => $expenseBreakdown
        ]);
    }
}
