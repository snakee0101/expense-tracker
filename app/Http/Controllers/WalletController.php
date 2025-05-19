<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\SavingsPlan;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $expenseQuery = "SUM(
                              CASE
                                  WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN amount
                                  WHEN destination_type = ? THEN amount
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
            ), month_wallets(wallet_id, month) AS (
                SELECT id, month
                FROM wallets
                CROSS JOIN months
                WHERE user_id = ?
            ), wallet_transactions AS (
                SELECT
                       MONTH(date) AS month,
                       IF(destination_type = ?, destination_id, source_id) AS wallet_id,
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
                       month, wallet_id
                FROM wallet_transactions
                GROUP BY month, wallet_id
            )
            SELECT m.wallet_id, m.month,
                   COALESCE(expense, 0) AS expense,
                   COALESCE(income, 0) AS income
            FROM month_wallets m
            LEFT JOIN income_expense_by_month i
                   ON m.month = i.month AND m.wallet_id = i.wallet_id
         SQL;

        $chartData = DB::select($sql, [
            //month_wallets
            auth()->id(),

            //wallet_transactions
            Wallet::class, //wallet check
            auth()->id(), TransactionStatus::Completed->value, //user_id and status
            Wallet::class, Wallet::class, SavingsPlan::class, SavingsPlan::class, //filter wallet transactions (destination type, source type)

            //income_expense_by_month
            Wallet::class, Card::class, Contact::class,  //expense
            Wallet::class, Card::class, //income
        ]);

        /*echo "<pre>";
        print_r($chartData);
        echo "</pre>";
*/
        return Inertia::render('wallets', [
            'wallets' => Wallet::where('user_id', auth()->id())->latest()->get(),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())->latest()->get(),
            'chartData' => $chartData
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('wallets')->where('user_id', auth()->id())
            ]
        ]);

        Wallet::create([
            'user_id' => auth()->id(),
            'name' => $request->name
        ]);

        return to_route('wallet.index');
    }

    public function update(Request $request, Wallet $wallet)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('wallets')->where('user_id', auth()->id())->ignore($wallet->id)
            ]
        ]);

        $wallet->update([
            'name' => $request->name
        ]);

        return to_route('wallet.index');
    }
}
