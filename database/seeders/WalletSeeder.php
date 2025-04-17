<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    public function run(): void
    {
        Wallet::factory()
                        ->withUser(User::first())
                        ->count(2)
                        ->create();
    }
}
