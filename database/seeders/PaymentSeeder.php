<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\PaymentCategory;
use App\Models\TransactionCategory;
use App\Models\User;
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
    }
}
