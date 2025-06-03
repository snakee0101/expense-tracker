<?php

namespace App\DataTransferObjects\Payments;

use App\Models\Payment;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

final readonly class DeductFromBalanceDto
{
    public function __construct(
        public Carbon $date,
        public Model $source,
        public float $amount
    ) {}

    public static function fromTransactionData(Transaction $transaction, Payment $payment): self
    {
        return new self(
            date: $transaction->date,
            source: $transaction->source,
            amount: $payment->amount,
        );
    }
}
