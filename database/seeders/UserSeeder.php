<?php

namespace Database\Seeders;

use App\Models\SpendingLimit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('12345')
        ]);

        SpendingLimit::create([
            'user_id' => $user->id
        ]);
    }
}
