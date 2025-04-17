<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\User;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    public function run(): void
    {
        Card::factory()
                        ->withUser(User::first())
                        ->count(2)
                        ->create();
    }
}
