<?php

namespace App\Queries\SavingsPlans;

use App\Enums\TransactionStatus;
use App\Models\SavingsPlan;
use Illuminate\Support\Facades\DB;

class SavingsChartDataQuery
{
    public function __invoke()
    {
        $savingsPlanBalancesSql = <<<SQL
            WITH months AS (
                SELECT 1 AS month UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 UNION ALL
                SELECT 10 UNION ALL
                SELECT 11 UNION ALL
                SELECT 12
            ),
            user_savings_plans AS (
                SELECT DISTINCT
                    CASE
                        WHEN destination_type = ? THEN destination_id
                        WHEN source_type = ? THEN source_id
                    END AS savings_plan_id
                FROM transactions
                WHERE user_id = ?
                  AND status = ?
                  AND (destination_type = ? OR source_type = ?)
            ),
            months_with_plans AS (
                SELECT m.month, usp.savings_plan_id
                FROM months m
                CROSS JOIN user_savings_plans usp
            ),
            base_data AS (
                SELECT
                    MONTH(date) AS month,
                    CASE
                        WHEN destination_type = ? THEN destination_id
                        WHEN source_type = ? THEN source_id
                    END AS savings_plan_id,
                    date,
                    CASE
                        WHEN destination_type = ? THEN amount
                        WHEN source_type = ? THEN -amount
                        ELSE 0
                    END AS signed_amount
                FROM transactions
                WHERE user_id = ?
                  AND status = ?
                  AND (destination_type = ? OR source_type = ?)
                  AND YEAR(date) = YEAR(CURDATE())
                  AND date < CURDATE()
            ),
            balance_data AS (
                SELECT
                    savings_plan_id,
                    MONTH(date) AS month,
                    SUM(signed_amount) OVER (
                        PARTITION BY savings_plan_id
                        ORDER BY MONTH(date)
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                    ) AS savings_plan_balance
                FROM base_data
            )
            SELECT
                mwp.month,
                mwp.savings_plan_id,
                CASE
                    WHEN mwp.month > MONTH(CURDATE()) THEN NULL
                    ELSE (
                        SELECT bd.savings_plan_balance
                        FROM balance_data bd
                        WHERE bd.savings_plan_id = mwp.savings_plan_id
                          AND bd.month <= mwp.month
                        ORDER BY bd.month DESC
                        LIMIT 1
                    )
                END AS savings_plan_balance
            FROM months_with_plans mwp
            ORDER BY mwp.savings_plan_id, mwp.month
        SQL;

        $savingsType = SavingsPlan::class;
        $userId = auth()->id();
        $status = TransactionStatus::Completed->value;

        return DB::select($savingsPlanBalancesSql, [
            // user_savings_plans CTE
            $savingsType, $savingsType, $userId, $status, $savingsType, $savingsType,

            // base_data CTE
            $savingsType, $savingsType,    // CASE savings_plan_id
            $savingsType, $savingsType,    // CASE signed_amount
            $userId,
            $status,
            $savingsType, $savingsType,
        ]);
    }
}
