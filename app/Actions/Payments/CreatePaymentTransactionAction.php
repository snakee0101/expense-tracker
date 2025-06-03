<?php

namespace App\Actions\Payments;

use App\DataTransferObjects\Payments\CreatePaymentTransactionDto;
use App\Models\Payment;
use App\Models\Transaction;

class CreatePaymentTransactionAction
{
    public function __invoke(CreatePaymentTransactionDto $dto): Transaction
    {
        return Transaction::create([
            'name' => $dto->name,
            'date' => $dto->date,
            'amount' => $dto->amount,
            'note' => $dto->note,
            'user_id' => auth()->id(),
            'source_type' => $dto->source_type,
            'source_id' => $dto->source_id,
            'destination_type' => Payment::class,
            'destination_id' => $dto->payment_id,
            'category_id' => $dto->category_id,
            'status' => $dto->status
        ]);
    }
}
