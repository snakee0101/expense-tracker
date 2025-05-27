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
        $targetBalance = \random_int(2000, 5000);

        return [
            'name' => fake()->sentence(3),
            'balance' => 0,
            'target_balance' => $targetBalance,
            'due_date' => now()->addMonths(rand(5, 12)),
            'savings_tips' => "<ul>
                <li><b>first</b> <u>savings</u> tip</li>
                <li><i>second</i> <span style='color: blue'>savings</span> tip</li>
            </ul>" . "<p>this is for plan: $targetBalance</p>",
        ];
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
