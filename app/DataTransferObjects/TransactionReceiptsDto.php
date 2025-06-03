<?php

namespace App\DataTransferObjects;

use App\Models\Transaction;

final readonly class TransactionReceiptsDto
{
    public function __construct(
        public array $receipts,
        public Transaction $transaction
    ) {}

    public static function fromTransactionData($request, Transaction $transaction): self
    {
        return new self(
            receipts: $request->hasFile('receipts') ? $request->receipts : [],
            transaction: $transaction
        );
    }
}
