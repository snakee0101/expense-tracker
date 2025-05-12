<?php

namespace App\Rules;

use App\Models\Card;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CheckCardExpiration implements ValidationRule
{
    public function __construct(protected $account)
    {

    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if($this->account::class != Card::class) {
            return;
        }

        if ($this->account->is_expired) {
            $fail('Cannot perform action. Card is expired');
        }
    }
}
