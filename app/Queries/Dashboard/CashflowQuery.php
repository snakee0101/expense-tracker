<?php

namespace App\Queries\Dashboard;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Wallet;

class CashflowQuery
{
    public function __invoke()
    {
        return Transaction::selectRaw('SUM(
                                            CASE
                                                 WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN amount
                                                 WHEN destination_type IN (?, ?) THEN -amount
                                            END
                                      ) AS expense',
            [
                Wallet::class, Card::class,
                Contact::class, Payment::class
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
            ->orderByRaw("MONTH(date)");
    }
}
