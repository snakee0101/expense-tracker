<?php

namespace Database\Factories;

use App\Models\RecurringPayment;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RecurringPaymentFactory extends Factory
{
    protected $model = RecurringPayment::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'period_starting_date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'repeat_period' => fake()->randomElement([7, 14, 30, 60, 90]),
            'amount' => fake()->randomFloat(2, 100, 500),
            'note' => fake()->optional()->sentence(),
            'is_active' => fake()->boolean(80),
        ];
    }

    public function withCategory(TransactionCategory $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
        ]);
    }

    public function withDestination($destination): static
    {
        return $this->state(fn (array $attributes) => [
            'destination_id' => $destination->id,
            'destination_type' => $destination::class
        ]);
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
