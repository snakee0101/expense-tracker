<?php

namespace App\Queries;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\Wallet;

class IncomeExpenseStatisticsQuery
{
    public function __invoke()
    {
        //formula for diffs (in currency units): current month total - previous month total
        $expenseQuery = "SUM(
                              CASE
                                  WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN -amount
                                  WHEN destination_type IN (?, ?) THEN amount
                                  ELSE 0
                              END
                         )";

        $incomeQuery = "SUM(
                             CASE
                                 WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount > 0 THEN amount
                                 ELSE 0
                             END
                        )";

        $savingsQuery = "SUM(
                             CASE
                                WHEN destination_type = ? THEN amount
                                WHEN source_type = ? THEN -amount
                                ELSE 0
                             END
                        )";

        $incomeExpenseStatistics = Transaction::query()
            ->selectRaw("$expenseQuery AS expense", [Wallet::class, Card::class, Contact::class, Payment::class])
            ->selectRaw("$incomeQuery AS income", [Wallet::class, Card::class])
            ->selectRaw("$savingsQuery AS savings", [SavingsPlan::class, SavingsPlan::class])
            ->selectRaw(
                "ROUND(
                    $expenseQuery - LAG($expenseQuery) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                , 2) AS expense_diff",
                [
                    Wallet::class, Card::class, Contact::class, Payment::class,
                    Wallet::class, Card::class, Contact::class, Payment::class
                ]
            )
            ->selectRaw(
                "ROUND(
                    $incomeQuery - LAG($incomeQuery) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                , 2) AS income_diff",
                [
                    Wallet::class, Card::class,
                    Wallet::class, Card::class
                ]
            )
            ->selectRaw(
                "ROUND(
                    $savingsQuery - LAG($savingsQuery) OVER (ORDER BY DATE_FORMAT(date, '%Y-%m'))
                , 2) AS savings_diff",
                [
                    SavingsPlan::class, SavingsPlan::class,
                    SavingsPlan::class, SavingsPlan::class
                ]
            )
            ->selectRaw('MONTH(date) as month')
            ->where('user_id', auth()->id())
            ->where('status', TransactionStatus::Completed)
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') IN (
                    DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m'),
                    DATE_FORMAT(CURDATE(), '%Y-%m')
            )")
            ->where('date', '<', now())
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m'), month");

        return $incomeExpenseStatistics;
    }
}
