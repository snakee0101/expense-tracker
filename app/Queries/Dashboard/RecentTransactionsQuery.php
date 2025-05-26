<?php

namespace App\Queries\Dashboard;

use App\Models\SavingsPlan;
use App\Models\Transaction;

class RecentTransactionsQuery
{
    public function __invoke()
    {
        return Transaction::where('user_id', auth()->id())
            ->with('category', 'source', 'destination', 'attachments')
            ->where([
                ['source_type', '!=', SavingsPlan::class],
                ['destination_type', '!=', SavingsPlan::class]
            ])
            ->orWhereNull('source_type')
            ->latest('date')
            ->take(5);
    }
}
