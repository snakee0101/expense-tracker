<?php

namespace Database\Factories;


use App\Models\Card;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardFactory extends Factory
{
    protected $model = Card::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->sentence(2),
            'card_number' => fake()->unique()->creditCardNumber(),
            'expiry_date' => fake()->dateTimeBetween('now', '+5 years'),
            'balance' => fake()->numberBetween(2000, 5000)
        ];
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
