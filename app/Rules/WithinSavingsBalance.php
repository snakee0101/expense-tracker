<?php

namespace App\Rules;

use App\Enums\TransactionStatus;
use App\Models\SavingsPlan;
use App\Models\Transaction;
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
        $futureSavingsPlanBalance = $this->savingsPlan->balance + $this->pendingTransactionsTotal();
        $finalSavingsPlanBalance = $this->amount + $futureSavingsPlanBalance;

        if($finalSavingsPlanBalance > $this->savingsPlan->target_balance) {
            $fail("This transaction exceeds the savings plan balance (pending transactions included). Maximum allowed amount: $" . number_format($this->savingsPlan->target_balance - $futureSavingsPlanBalance, 2));
        }

        if($finalSavingsPlanBalance < 0) {
            $fail("Can't withdraw more than savings plan balance (pending transactions included). Maximum allowed amount: $" . number_format($futureSavingsPlanBalance, 2));
        }
    }

    private function pendingTransactionsTotal()
    {
        return Transaction::selectRaw("COALESCE(SUM(CASE WHEN destination_type = ? THEN amount ELSE -amount END), 0) AS total", [SavingsPlan::class])
                            ->where(function($q) {
                                $q->where([
                                    ['source_type', SavingsPlan::class],
                                    ['source_id', $this->savingsPlan->id]
                                ])->orWhere([
                                    ['destination_type', SavingsPlan::class],
                                    ['destination_id', $this->savingsPlan->id]
                                ]);
                            })
                            ->where('status', TransactionStatus::Pending)
                            ->value('total');
    }
}
