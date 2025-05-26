<?php

namespace App\Actions;

use App\Models\Transaction;

class SaveTransactionReceiptsAction
{
    public function __invoke($request, Transaction $transaction)
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
