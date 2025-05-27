<?php

namespace Database\Seeders;

use App\Actions\Payments\DeductFromBalanceAction;
use App\Models\Payment;
use App\Models\PaymentCategory;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        PaymentCategory::all()->each(function(PaymentCategory $paymentCategory) {
            Payment::factory()
                ->withCategory(TransactionCategory::inRandomOrder()->first())
                ->withUser(User::first())
                ->withPaymentCategory($paymentCategory)
                ->count(3)
                ->create();
        });

        // fill payment transactions
        $user = User::first();
        auth()->login($user);

        Payment::all()->each(function (Payment $payment) use ($user) {
            $transactions = Transaction::factory()
                ->withSource(Wallet::inRandomOrder()->first())
                ->withDestination($payment)
                ->withCategory($payment->category)
                ->withUser($user)
                ->count(3)
                ->create();

            $transactions->each(function (Transaction $transaction) use ($payment) {
                app()->call(DeductFromBalanceAction::class, [
                    'transaction' => $transaction,
                    'payment' => $payment
                ]);
            });
        });
    }
}
