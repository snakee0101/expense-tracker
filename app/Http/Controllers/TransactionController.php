<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Transaction;
use Inertia\Inertia;

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
}
