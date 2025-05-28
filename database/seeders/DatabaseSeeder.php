<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(TransactionCategorySeeder::class);
        $this->call(WalletSeeder::class);
        $this->call(CardSeeder::class);
        $this->call(SavingsPlanSeeder::class);
        $this->call(ContactSeeder::class);
        $this->call(NotificationSeeder::class);
        $this->call(PaymentCategorySeeder::class);
        $this->call(PaymentSeeder::class);
        $this->call(IncomeExpenseTransactionSeeder::class);
        $this->call(TransferSeeder::class);
    }
}
