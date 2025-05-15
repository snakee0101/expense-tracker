<?php

namespace App\Actions;

use App\Models\Attachment;
use App\Models\Transaction;
use Illuminate\Support\Facades\Storage;

class DeleteTransaction
{
    private Transaction $transaction;

    public function __invoke(Transaction $transaction)
    {
        $this->transaction = $transaction;

        $this->deleteAttachments();
        $this->cancelTransaction();
        $this->deleteTransaction();
    }

    private function deleteAttachments()
    {
        $storagePaths = $this->transaction->attachments
                                            ->map(fn (Attachment $attachment) => $attachment->storage_location)
                                            ->toArray();

        Storage::disk('public')->delete($storagePaths);
        Attachment::destroy($this->transaction->attachments);
    }

    private function cancelTransaction()
    {
        app()->call(
            CancelTransaction::class,
            ['transaction' => $this->transaction]
        );
    }

    private function deleteTransaction()
    {
        $this->transaction->delete();
    }
}
