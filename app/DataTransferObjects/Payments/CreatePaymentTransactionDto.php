<?php

namespace App\DataTransferObjects\Payments;

use Carbon\Carbon;
use App\Models\Payment;
use App\Enums\TransactionStatus;

final readonly class CreatePaymentTransactionDto
{
    public function __construct(
        public string $name,
        public Carbon $date,
        public float $amount,
        public string|null $note,
        public string $source_type,
        public int $source_id,
        public int $payment_id,
        public int $category_id,
        public TransactionStatus $status
    ) {}

    public static function fromPayment($request, Payment $payment): self
    {
        $date = Carbon::parse("{$request->date} {$request->time}");
        $status = $date->isFuture() ? TransactionStatus::Pending 
                                    : TransactionStatus::Completed;

        return new self(
            name: $payment->name,
            date: $date,
            amount: (float) $request->amount,
            note: $request->note,
            source_type: $request->source_type,
            source_id: (int) $request->source_id,
            payment_id: $payment->id,
            category_id: $payment->category_id,
            status: $status
        );
    }
}
