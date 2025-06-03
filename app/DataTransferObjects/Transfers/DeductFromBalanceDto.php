<?php

namespace App\DataTransferObjects\Transfers;

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

    public static function fromTransaction(Transaction $transaction): self
    {
        return new self(
            date: $transaction->date,
            source: $transaction->source,
            amount: $transaction->amount,
        );
    }
}
