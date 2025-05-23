<?php

namespace App\Http\Controllers;

use App\Actions\CancelTransaction;
use App\Actions\DeleteTransaction;
use App\Actions\RedoTransaction;
use App\Enums\TransactionStatus;
use App\Exports\TransactionsExport;
use App\Models\Transaction;
use App\Services\Search;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('transactions', [
            'transactions' => $this->getFilteredTransactions()->paginate(10),
            'transactionStatusList' => TransactionStatus::toSelectOptions()
        ]);
    }

    protected function getFilteredTransactions(): Builder
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

    public function search()
    {
        return $this->getFilteredTransactions()->paginate(10);
    }

    public function export()
    {
        $transactions = $this->getFilteredTransactions()->get();

        return Excel::download(new TransactionsExport($transactions), 'transactions.xlsx');
    }

    public function cancel(Request $request, Transaction $transaction)
    {
        app()->call(
            CancelTransaction::class,
            ['transaction' => $transaction]
        );

        return to_route('transaction.index');
    }

    public function redo(Request $request, Transaction $transaction)
    {
        app()->call(
            RedoTransaction::class,
            ['transaction' => $transaction]
        );

        return to_route('transaction.index');
    }

    public function destroy(Request $request, Transaction $transaction)
    {
        app()->call(
            DeleteTransaction::class,
            ['transaction' => $transaction]
        );

        return to_route('transaction.index');
    }
}
