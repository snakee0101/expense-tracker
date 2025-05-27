<?php

namespace App\Queries\SavingsPlans;

use App\Enums\TransactionStatus;
use App\Models\SavingsPlan;
use App\Models\Transaction;

class TotalSavingsGainQuery
{
    public function __invoke(): float
    {
        return Transaction::selectRaw( //formula:  100% * (current month total - previous month total) / (previous month total)
            "ROUND( 100 * (
                    SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END )
                  - LAG(SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END )) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                 ) / (
                    LAG(SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END )) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                 ), 2) AS monthly_diff",
            [SavingsPlan::class, SavingsPlan::class, SavingsPlan::class]
        ) //if money is transferred TO savings plan, then the sign is "+", otherwise its "-";
            ->selectRaw("DATE_FORMAT(date, '%Y-%m') AS month")
            ->where('user_id', auth()->id())
            ->where(function($q) {
                $q->where('source_type', SavingsPlan::class)
                    ->orWhere('destination_type', SavingsPlan::class);
            })
            ->whereDate('date', '<=', now())
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') IN (
                    DATE_FORMAT(CURDATE(), '%Y-%m'),
                    DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
             )") //include statistics for current and previous month only
            ->where('status', TransactionStatus::Completed)
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m')")
            ->get()
            ->sum('monthly_diff');
    }
}
