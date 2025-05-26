<?php

namespace App\Queries\Dashboard;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;

class CashflowQuery
{
    public function __invoke(): array
    {
        $expenseQuery = "SUM(
            CASE
                WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN amount
                WHEN destination_type IN (?, ?) THEN -amount
                ELSE 0
            END
        )";

        $incomeQuery = "SUM(
            CASE
                WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount > 0 THEN amount
                ELSE 0
            END
        )";

        $sql = <<<SQL
            WITH months(month_num, month_name) AS (
                SELECT 1, 'Jan' UNION ALL
                SELECT 2, 'Feb' UNION ALL
                SELECT 3, 'Mar' UNION ALL
                SELECT 4, 'Apr' UNION ALL
                SELECT 5, 'May' UNION ALL
                SELECT 6, 'Jun' UNION ALL
                SELECT 7, 'Jul' UNION ALL
                SELECT 8, 'Aug' UNION ALL
                SELECT 9, 'Sep' UNION ALL
                SELECT 10, 'Oct' UNION ALL
                SELECT 11, 'Nov' UNION ALL
                SELECT 12, 'Dec'
            ), cashflow_data AS (
                SELECT
                    MONTH(date) AS month_num,
                    $expenseQuery AS expense,
                    $incomeQuery AS income
                FROM transactions
                WHERE user_id = ?
                  AND status = ?
                  AND date BETWEEN ? AND ?
                GROUP BY MONTH(date)
            )
            SELECT m.month_name AS month,
                   COALESCE(c.expense, 0) AS expense,
                   COALESCE(c.income, 0) AS income
            FROM months m
            LEFT JOIN cashflow_data c ON m.month_num = c.month_num
            ORDER BY m.month_num
        SQL;

        return DB::select($sql, [
            // expense bindings
            Wallet::class, Card::class,
            Contact::class, Payment::class,

            // income bindings
            Wallet::class, Card::class,

            // user_id, status, date range
            auth()->id(),
            TransactionStatus::Completed->value,
            now()->startOfYear()->setTime(0, 0, 0),
            now()->endOfYear()->setTime(23, 59, 59),
        ]);
    }
}

