<?php

namespace App\Actions;

use App\DataTransferObjects\TransactionReceiptsDto;

class SaveTransactionReceiptsAction
{
    public function __invoke(TransactionReceiptsDto $dto)
    {
        foreach ($dto->receipts as $file) {
            $filePath = $file->store('attachments', 'public');

            $dto->transaction->attachments()->create([
                'original_filename' => $file->getClientOriginalName(),
                'storage_location' => $filePath
            ]);
        }
    }
}