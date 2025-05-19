<?php

namespace Database\Seeders;

use App\Models\PaymentCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentCategorySeeder extends Seeder
{
    public function run(): void
    {
        PaymentCategory::factory()
            ->withUser(User::first())
            ->count(3)
            ->create();
    }
}
