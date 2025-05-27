<?php

namespace Database\Factories;

use App\Enums\TransactionStatus;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'date' => fake()->dateTimeBetween('-3 months', 'now'),
            'amount' => fake()->randomFloat(2, 1, 1000),
            'note' => fake()->optional()->sentence(),
            'status' => TransactionStatus::Completed,
        ];
    }

    public function withSource($model): static
    {
        return $this->state(fn () => [
            'source_id' => $model->id,
            'source_type' => get_class($model),
        ]);
    }

    public function withDestination($model): static
    {
        return $this->state(fn () => [
            'destination_id' => $model->id,
            'destination_type' => get_class($model),
        ]);
    }

    public function withCategory(TransactionCategory $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
        ]);
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
