<?php

namespace App\Rules;

use App\Models\Card;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CheckCardExpiration implements ValidationRule
{
    public function __construct(protected Card $card)
    {

    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->card->is_expired) {
            $fail('Cannot perform action. Card is expired');
        }
    }
}
