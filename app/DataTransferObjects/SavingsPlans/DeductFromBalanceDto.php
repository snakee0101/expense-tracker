<?php

namespace App\DataTransferObjects\SavingsPlans;

use App\Models\Card;
use App\Models\Wallet;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Carbon\Carbon;

final readonly class DeductFromBalanceDto
{
    public function __construct(
        public Carbon $date,
        public float $amount,
        public SavingsPlan $savingsPlan,
        public Wallet|Card $account
    ) {}

    public static function fromTransactionData($request, Transaction $transaction): self
    {
        $savingsPlan = SavingsPlan::findOrFail($request->savings_plan_id);
        $account = ($request->related_account_type)::findOrFail($request->related_account_id);
        $isNegativeBalance = $request->boolean('is_withdraw') ? 1 : -1;

        return new self(
            date: $transaction->date,
            amount: (float) $request->amount * $isNegativeBalance,
            savingsPlan: $savingsPlan,
            account: $account
        );
    }
}