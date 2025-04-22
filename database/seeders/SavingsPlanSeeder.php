<?php

namespace Database\Seeders;

use App\Models\SavingsPlan;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavingsPlanSeeder extends Seeder
{
    public function run(): void
    {
        SavingsPlan::factory()
            ->withUser(User::first())
            ->count(2)
            ->create();
    }
}
