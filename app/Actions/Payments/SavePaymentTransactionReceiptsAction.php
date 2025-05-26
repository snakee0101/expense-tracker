<?php

namespace App\Actions\Payments;

use App\Http\Requests\Payments\MakePaymentRequest;
use App\Models\Transaction;

class SavePaymentTransactionReceiptsAction
{
    public function __invoke(MakePaymentRequest $request, Transaction $transaction)
    {
        $receipts = [];

        if ($request->receipts) {
            $receipts = $request->file('receipts');
        }

        foreach ($receipts as $file) {
            $filePath = $file->store('attachments', 'public');

            $transaction->attachments()->create([
                'original_filename' => $file->getClientOriginalName(),
                'storage_location' => $filePath
            ]);
        }
    }
}
