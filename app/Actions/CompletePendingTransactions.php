<?php

namespace App\Actions;

use App\Enums\TransactionStatus;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class CompletePendingTransactions
{
    public function __invoke()
    {
        $query = Transaction::where('status', TransactionStatus::Pending)
            ->whereDate('date', '<=', now())
            ->with('source', 'destination');

        $this->updateAccountBalance($query->get());
        $this->setStatus($query);
    }

    public function setStatus(Builder $query): void
    {
        $query->update([
            'status' => TransactionStatus::Completed
        ]);
    }

    private function updateAccountBalance(Collection $transactions): void
    {
        $transactions->each(function (Transaction $transaction) {
            $transaction->source?->fill(['balance' => $transaction->source->balance - $transaction->amount]);
            $transaction->source?->save();

            $transaction->destination->fill(['balance' => $transaction->destination->balance + $transaction->amount]);
            $transaction->destination->save();
        });
    }
}
