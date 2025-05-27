<?php

namespace App\Http\Controllers;

use App\Actions\CancelTransaction;
use App\Actions\DeleteTransaction;
use App\Actions\RedoTransaction;
use App\Actions\Transactions\GetFilteredTransactionAction;
use App\Enums\TransactionStatus;
use App\Exports\TransactionsExport;
use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('transactions', [
            'transactions' => app()->call(GetFilteredTransactionAction::class)->paginate(10),
            'transactionStatusList' => TransactionStatus::toSelectOptions()
        ]);
    }

    public function search()
    {
        return app()->call(GetFilteredTransactionAction::class)->paginate(10);
    }

    public function export()
    {
        $transactions = app()->call(GetFilteredTransactionAction::class)->get();

        return Excel::download(new TransactionsExport($transactions), 'transactions.xlsx');
    }

    public function cancel(TransactionRequest $request, Transaction $transaction)
    {
        app()->call(
            CancelTransaction::class,
            ['transaction' => $transaction]
        );

        return to_route('transaction.index');
    }

    public function redo(TransactionRequest $request, Transaction $transaction)
    {
        app()->call(
            RedoTransaction::class,
            ['transaction' => $transaction]
        );

        return to_route('transaction.index');
    }

    public function destroy(TransactionRequest $request, Transaction $transaction)
    {
        app()->call(
            DeleteTransaction::class,
            ['transaction' => $transaction]
        );

        return to_route('transaction.index');
    }
}
