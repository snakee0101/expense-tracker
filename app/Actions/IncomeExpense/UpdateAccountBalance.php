<?php

namespace App\Actions\IncomeExpense;

use App\Models\Transaction;

class UpdateAccountBalance
{
    public function __invoke(Transaction $transaction): void
    {
        if ($transaction->date->isNowOrPast()) {
            $transaction->destination->increment('balance', $transaction->amount);
        }
    }
}
