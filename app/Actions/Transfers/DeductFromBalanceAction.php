<?php

namespace App\Actions\Transfers;

use App\Models\Transaction;

/**
 * Changes balance of wallet/card where you transfer money from
 **/
class DeductFromBalanceAction
{
    public function __invoke(Transaction $transaction)
    {
        if ($transaction->date->isNowOrPast()) {
            $transaction->source->decrement('balance', $transaction->amount);
        }
    }
}
