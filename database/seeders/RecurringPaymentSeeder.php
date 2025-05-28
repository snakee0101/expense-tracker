<?php

namespace Database\Seeders;

use App\Models\RecurringPayment;
use App\Models\TransactionCategory;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class RecurringPaymentSeeder extends Seeder
{
    public function run(): void
    {
        TransactionCategory::all()->each(function(TransactionCategory $category) {
            RecurringPayment::factory()
                ->withCategory($category)
                ->withDestination(Wallet::first())
                ->withUser(User::first())
                ->create();
        });
    }
}
