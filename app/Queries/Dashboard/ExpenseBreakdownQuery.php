<?php

namespace App\Queries\Dashboard;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Wallet;

class ExpenseBreakdownQuery
{
    public function __invoke($expenseBreakdownStartingDate, $expenseBreakdownEndingDate)
    {
        return Transaction::with('category')
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
            ->groupBy('category_id');
    }
}

