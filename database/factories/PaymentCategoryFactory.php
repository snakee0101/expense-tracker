<?php

namespace Database\Factories;

use App\Models\PaymentCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentCategoryFactory extends Factory
{
    protected $model = PaymentCategory::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->sentence(2),
            'image_path' => 'public/images/category_image.png',
        ];
    }

    public function withUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
