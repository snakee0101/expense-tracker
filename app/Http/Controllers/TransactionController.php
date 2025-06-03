<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Transaction;
use App\Actions\RedoTransaction;
use App\Actions\CancelTransaction;
use App\Actions\DeleteTransaction;
use App\Exports\TransactionsExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Requests\TransactionRequest;
use App\Http\Requests\IncomeExpenseRequest;
use App\Actions\Transactions\GetFilteredTransactionAction;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('transactions', [
            'transactions' => app()->call(GetFilteredTransactionAction::class)->paginate(10)
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

    public function update(IncomeExpenseRequest $request, Transaction $transaction)
    {
/*
        $transaction = app()->call(CreateIncomeExpenseTransaction::class, [
            'dto' => IncomeExpenseDto::fromRequest($request)
        ]);

        app()->call(UpdateAccountBalance::class, [
            'transaction' => $transaction
        ]);

        app()->call(SaveTransactionReceiptsAction::class, [
            'dto' => TransactionReceiptsDto::fromTransactionData($request, $transaction),
        ]);

        return back();
*/
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
