<?php

namespace App\Actions\SavingsPlans;

use App\Models\SavingsPlan;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Model;

class DeductFromBalanceAction
{
    public function __invoke(Transaction $transaction, $request)
    {
        if ($transaction->date->isNowOrPast()) {
            $isNegativeBalance = $request->boolean('is_withdraw') ? 1 : -1;

            //change balance of savings plan
            $this->savingsPlan($request)->decrement('balance', $request->amount * $isNegativeBalance);

            //change balance of wallet/card
            $this->account($request)->increment('balance', $request->amount * $isNegativeBalance);
        }
    }

    protected function savingsPlan($request): SavingsPlan
    {
        return SavingsPlan::findOrFail($request->savings_plan_id);
    }

    protected function account($request): Model
    {
        return ($request->related_account_type)::findOrFail($request->related_account_id);
    }
}
