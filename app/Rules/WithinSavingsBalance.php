<?php

namespace App\Rules;

use App\Models\SavingsPlan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WithinSavingsBalance implements ValidationRule
{
    public function __construct(protected SavingsPlan $savingsPlan,
                                protected $amount)
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $finalSavingsPlanBalance = $this->amount + $this->savingsPlan->balance;

        if($finalSavingsPlanBalance > $this->savingsPlan->target_balance) {
            $fail("This transaction exceeds the savings plan balance. Maximum allowed amount: $" . number_format($this->savingsPlan->target_balance - $this->savingsPlan->balance, 2));
        }

        if($finalSavingsPlanBalance < 0) {
            $fail("Can't withdraw more than savings plan balance. Maximum allowed amount: $" . number_format($this->savingsPlan->balance, 2));
        }
    }
}
