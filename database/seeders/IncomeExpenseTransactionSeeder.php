<?php

namespace Database\Seeders;

use App\Actions\IncomeExpense\UpdateAccountBalance;
use App\Models\Card;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class IncomeExpenseTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        auth()->login($user);

        Card::all()->each(function (Card $card) use ($user) {
            $transactions = Transaction::factory()
                ->withDestination($card)
                ->withCategory(TransactionCategory::inRandomOrder()->first())
                ->withUser($user)
                ->withNegativeAmount()
                ->count(5)
                ->create();

            $transactions->each(function (Transaction $transaction) use ($card) {
                app()->call(UpdateAccountBalance::class, [
                    'transaction' => $transaction,
                    'income' => $transaction->amount
                ]);
            });
        });
    }
}
