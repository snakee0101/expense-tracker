<?php

namespace App\Actions\Transactions;

use App\Enums\TransactionStatus;
use App\Models\Transaction;
use App\Services\Search;
use Illuminate\Database\Eloquent\Builder;

class GetFilteredTransactionAction
{
    public function __invoke(): Builder
    {
        $statuses = [];

        if(request()->filled('status')) {
            $statuses = array_map(function ($statusName) {
                return TransactionStatus::fromCaseName($statusName)->value;
            }, request('status'));
        }

        return (new Search(Transaction::where('user_id', auth()->id())->with('category', 'source', 'destination', 'attachments')))
            ->setMultipleEqualityFilter(['name', 'note'], request('name'))
            ->setMultipleOptionsFilter('status', $statuses)
            ->setDateRangeFilter('date', request('date') ? request('date')[0]['startDate'] : null, request('date')[0]['endDate'] ?? null) //input format: [0 => [startDate:2025-05-13T21:00:00.000Z, endDate:...]]
            ->setAbsoluteRangeFilter('amount', request('amount') ? request('amount')['rangeStart'] : null, request('amount')['rangeEnd'] ?? null)
            ->setAttachmentsFilter(request()->boolean('hasAttachments'))
            ->setTransactionTypesFilter(request('transactionTypes'))
            ->getQuery()
            ->latest('date');
    }
}
