<?php

namespace Database\Factories;

use App\Models\SavingsPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SavingsPlan>
 */
class SavingsPlanFactory extends Factory
{
    protected $model = SavingsPlan::class;

    public function definition(): array
    {
        $targetBalance = fake()->randomFloat(2, 500, 5000);
        $currentBalance = fake()->randomFloat(2, 0, $targetBalance);

        return [
            'name' => fake()->sentence(3),
            'balance' => $currentBalance,
            'target_balance' => $targetBalance,
            'due_date' => now()->addMonths(rand(5, 12)),
            'savings_tips' => fake()->paragraph(),
        ];
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
