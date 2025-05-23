<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ExpiryDate implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $value)) {
            $fail('Expiry date must be in the format MM/YY');
        }

        $this->checkForDateInThePast($value, $fail);
    }

    protected function checkForDateInThePast($value, $fail)
    {
        [$month, $year] = explode('/', $value);
        $currentYear = (int) date('y');
        $currentMonth = (int) date('m');

        if($year <= $currentYear && ($year != $currentYear || $month < $currentMonth)) {
            $fail('Expiry date must not be in the past');
        }
    }
}
