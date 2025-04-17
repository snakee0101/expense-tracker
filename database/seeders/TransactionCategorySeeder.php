<?php

namespace Database\Seeders;

use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionCategorySeeder extends Seeder
{
    public function run(): void
    {
        TransactionCategory::factory()
                        ->withUser(User::first())
                        ->count(3)
                        ->create();
    }
}
