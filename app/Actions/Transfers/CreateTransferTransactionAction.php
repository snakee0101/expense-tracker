<?php

namespace App\Actions\Transfers;

use App\Enums\TransactionStatus;
use App\Models\Contact;
use App\Models\Transaction;
use Carbon\Carbon;

class CreateTransferTransactionAction
{
    public function __invoke($request): Transaction
    {
        $transactionDate = Carbon::parse("{$request->date} {$request->time}");

        $transaction = Transaction::create([
            'name' => $request->name,
            'date' => $transactionDate,
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'source_id' => $request->source_id,
            'source_type' => $request->source_type,
            'destination_id' => $request->contact_id,
            'destination_type' => Contact::class,
            'status' => $transactionDate->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);

        return $transaction;
    }
}
