<?php

namespace App\Actions;

use App\Enums\TransactionStatus;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class CancelTransaction
{
    private Transaction $transaction;

    public function __invoke(Transaction $transaction)
    {
        $this->transaction = $transaction;

        $this->updateDestinationAccountBalance($transaction->destination);
        $this->updateSourceAccountBalance($transaction->source);
        $this->setStatus($transaction);
    }

    private function updateDestinationAccountBalance(Model $destination)
    {
        if(Schema::hasColumn($destination->getTable(), 'balance') === false) {
            return;
        }

        $destination->update(['balance' => $destination->balance - $this->transaction->amount]);
    }

    private function updateSourceAccountBalance(Model|null $source)
    {
        if(is_null($source) || Schema::hasColumn($source->getTable(), 'balance') === false) {
            return;
        }

        $source->update(['balance' => $source->balance + $this->transaction->amount]);
    }

    private function setStatus(Transaction $transaction)
    {
        $transaction->update([
            'status' => TransactionStatus::Cancelled
        ]);
    }
}
