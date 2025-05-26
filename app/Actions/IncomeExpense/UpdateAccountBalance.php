<?php

namespace App\Actions\IncomeExpense;

use App\Models\Transaction;

class UpdateAccountBalance
{
    public function __invoke(Transaction $transaction, $income)
    {
        if ($transaction->date->isNowOrPast()) {
            $transaction->destination->increment('balance', $income);
        }
    }
}
