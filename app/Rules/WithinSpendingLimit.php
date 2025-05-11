<?php

namespace App\Rules;

use App\Enums\TransactionStatus;
use App\Models\SpendingLimit;
use Carbon\CarbonInterface;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WithinSpendingLimit implements ValidationRule
{
    public function __construct(public bool $isSpending,
                                public CarbonInterface $transactionDate)
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        //ignore, if it's not a spending transaction or spending limit is not set
        if($this->isSpending === false || is_null($spendingLimit->limit_amount)) {
            return;
        }

        $amountSpent = $spendingLimit->amountSpent(
            currentDate: $this->transactionDate,
            statuses: [TransactionStatus::Completed, TransactionStatus::Pending]
        );

        if($amountSpent + abs($value) > $spendingLimit->limit_amount) {
            $fail("This transaction exceeds the allowed spending limit ($" . number_format($spendingLimit->limit_amount, 2) . "). Maximum allowed amount: $" . number_format($spendingLimit->limit_amount - $amountSpent, 2));
        }
    }
}
