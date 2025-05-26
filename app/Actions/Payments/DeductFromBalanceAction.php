<?php

namespace App\Actions\Payments;

use App\Models\Payment;
use App\Models\Transaction;

class DeductFromBalanceAction
{
    public function __invoke(Transaction $transaction, Payment $payment)
    {
        if ($transaction->date->isNowOrPast()) {
            $transaction->source->decrement('balance', $payment->amount);
        }
    }
}
