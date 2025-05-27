<?php

namespace Database\Seeders;

use App\Actions\IncomeExpense\UpdateAccountBalance;
use App\Models\Card;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavingsPlanSeeder extends Seeder
{
    public function run(): void
    {
        $savingsPlans = SavingsPlan::factory()
            ->withUser($user = User::first())
            ->count(2)
            ->create();

        $savingsPlans->each(function (SavingsPlan $savingsPlan) use ($user) {
            $card = Card::inRandomOrder()->first();

            $transactions = Transaction::factory()
                ->withSource($card)
                ->withDestination($savingsPlan)
                ->withCategory(TransactionCategory::inRandomOrder()->first())
                ->withUser($user)
                ->count(2)
                ->create();

            $transactions->each(function (Transaction $transaction) use ($card, $savingsPlan) {
                $card->update([
                    'balance' => $card->balance - $transaction->amount
                ]);

                $savingsPlan->update([
                    'balance' => $savingsPlan->balance + $transaction->amount
                ]);
            });
        });
    }
}
