<?php

namespace App\Actions\Transfers;

use App\Models\Contact;
use App\Models\Transaction;
use App\Enums\TransactionStatus;
use App\DataTransferObjects\Transfers\TransferTransactionDto;

class CreateTransferTransactionAction
{
    public function __invoke(TransferTransactionDto $dto): Transaction
    {
        $status = $dto->date->isFuture()
                ? TransactionStatus::Pending
                : TransactionStatus::Completed;
        
        return Transaction::create([
            'name' => $dto->name,
            'date' => $dto->date,
            'amount' => $dto->amount,
            'note' => $dto->note,
            'user_id' => auth()->id(),
            'category_id' => $dto->category_id,
            'source_id' => $dto->source_id,
            'source_type' => $dto->source_type,
            'destination_id' => $dto->contact_id,
            'destination_type' => Contact::class,
            'status' => $status,
        ]);
    }
}
