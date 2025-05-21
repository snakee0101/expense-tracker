<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class AccountTransactionsController extends Controller
{
    public function __invoke(Request $request)
    {
        return Transaction::where('user_id', auth()->id())
            ->with('category', 'source', 'destination')
            ->when($request->filled('account_type'), function($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('source_type', $request->account_type)
                          ->where('source_id', $request->account_id);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('destination_type', $request->account_type)
                          ->where('destination_id', $request->account_id);
                    });
                });
            })
            ->orderByDesc('date')
            ->paginate(5);
    }
}
