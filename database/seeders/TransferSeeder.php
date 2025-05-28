<?php

namespace Database\Seeders;

use App\Actions\Transfers\DeductFromBalanceAction;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransferSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        auth()->login($user);

        Contact::all()->each(function (Contact $contact) use ($user) {
            $transactions = Transaction::factory()
                ->withSource(Card::inRandomOrder()->first())
                ->withDestination($contact)
                ->withCategory(TransactionCategory::inRandomOrder()->first())
                ->withUser($user)
                ->count(2)
                ->create();

            $transactions->each(function (Transaction $transaction) {
                app()->call(DeductFromBalanceAction::class, ['transaction' => $transaction]);
            });
        });
    }
}
