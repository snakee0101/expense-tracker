<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\SpendingLimit;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        if (now()->dayOfMonth <= $spendingLimit->day_of_month_period_start) { //suppose period starts at 15th day, but now is 7th
            $startingDate = now()->subMonth()->setDay($spendingLimit->day_of_month_period_start)->setTime(0,0,0); //then the date range starts at 15th day of previous month and ends now
            $endingDate = now();
        } else {
            $startingDate = now()->setDay($spendingLimit->day_of_month_period_start)->setTime(0,0,0); //otherwise the period starts at $spendingLimit->day_of_month_period_start at current month and ends now
            $endingDate = now();
        }

        /**
         *  1. Card and Wallet transactions - income/expense (for those only the destination_type is set to Wallet or Card) - just take the expenses (amount < 0)
         *  2. Transfer - it is an expense (no need to change sign)
         * */
        $amountSpent = Transaction::selectRaw('SUM(
                                                CASE
                                                    WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN -amount
                                                    WHEN destination_type = ? THEN amount
                                                END
                                            ) AS amount_spent', [
                                                Wallet::class, Card::class,
                                                Contact::class
                                            ])
                                        ->where('user_id', auth()->id())
                                        ->where('status', TransactionStatus::Completed)
                                        ->whereBetween('date', [$startingDate, $endingDate])
                                        ->value('amount_spent');

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit,
            'amountSpent' => $amountSpent
        ]);
    }
}
