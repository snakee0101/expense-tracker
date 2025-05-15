<?php

namespace App\Http\Controllers;

use App\Actions\CancelTransaction;
use App\Enums\TransactionStatus;
use App\Exports\TransactionsExport;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('transactions', [
            'transactions' => Transaction::where('user_id', auth()->id())
                                                                ->with('category', 'source', 'destination', 'attachments')
                                                                ->latest('date')
                                                                ->paginate(10),
            'transactionStatusList' => TransactionStatus::toSelectOptions()
        ]);
    }

    public function export(Request $request)
    {
        $transactions =  Transaction::where('user_id', auth()->id())
                                    ->with('category', 'source', 'destination')
                                    ->latest('date')
                                    ->get();

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
}
