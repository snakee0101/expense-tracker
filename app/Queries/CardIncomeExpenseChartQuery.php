<?php

namespace App\Queries;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\SavingsPlan;
use Illuminate\Support\Facades\DB;

class CardIncomeExpenseChartQuery
{
    public function __invoke()
    {
        $expenseQuery = "SUM(
                              CASE
                                  WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN amount
                                  WHEN destination_type = ? THEN amount
                                  WHEN destination_type = ? THEN -amount
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
            WITH RECURSIVE months(month) AS (
                SELECT 1
                UNION ALL
                SELECT month + 1
                FROM months
                WHERE month < 12
            ), month_cards(card_id, month) AS (
                SELECT id, month
                FROM cards
                CROSS JOIN months
                WHERE user_id = ?
            ), card_transactions AS (
                SELECT
                       MONTH(date) AS month,
                       IF(destination_type = ?, destination_id, source_id) AS card_id,
                source_type, destination_type, amount
                FROM transactions
                WHERE user_id = ?
                  AND status = ?
                  AND YEAR(date) = YEAR(CURDATE())
                  AND date <= CURDATE()
                  AND (destination_type = ? OR source_type = ?)
                  AND destination_type <> ?
                  AND (source_type <> ? OR source_type IS NULL)
            ), income_expense_by_month AS (
                SELECT $expenseQuery AS expense, $incomeQuery AS income,
                       month, card_id
                FROM card_transactions
                GROUP BY month, card_id
            )
            SELECT m.card_id, m.month,
                   COALESCE(expense, 0) AS expense,
                   COALESCE(income, 0) AS income
            FROM month_cards m
            LEFT JOIN income_expense_by_month i
                   ON m.month = i.month AND m.card_id = i.card_id
         SQL;

        $chartData = DB::select($sql, [
            //month_cards
            auth()->id(),

            //card_transactions
            Card::class, //wallet check
            auth()->id(), TransactionStatus::Completed->value, //user_id and status
            Card::class, Card::class, SavingsPlan::class, SavingsPlan::class, //filter wallet transactions (destination type, source type)

            //income_expense_by_month
            Card::class, Card::class, Contact::class, Payment::class, //expense
            Card::class, Card::class, //income
        ]);

        return $chartData;
    }
}
