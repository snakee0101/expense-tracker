<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\PaymentCategory;
use App\Models\TransactionCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(asText: true),
            'account_number' => $this->faker->bankAccountNumber(),
            'amount' => $this->faker->randomFloat(2, 10, 100),
        ];
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

    public function withPaymentCategory(PaymentCategory $category): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_category_id' => $category->id,
        ]);
    }
}
