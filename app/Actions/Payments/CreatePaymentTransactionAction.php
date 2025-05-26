<?php

namespace App\Actions\Payments;

use App\Enums\TransactionStatus;
use App\Http\Requests\Payments\MakePaymentRequest;
use App\Models\Payment;
use App\Models\Transaction;
use Carbon\Carbon;

class CreatePaymentTransactionAction
{
    public function __invoke(MakePaymentRequest $request, Payment $payment): Transaction
    {
        $transaction_date = Carbon::parse("{$request->date} {$request->time}");

        return Transaction::create([
            'name' => $payment->name,
            'date' => $transaction_date,
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'source_type' => $request->source_type,
            'source_id' => $request->source_id,
            'destination_type' => Payment::class,
            'destination_id' => $payment->id,
            'category_id' => $payment->category_id,
            'status' => $transaction_date->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);
    }
}
