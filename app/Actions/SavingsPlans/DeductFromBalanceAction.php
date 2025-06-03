<?php

namespace App\Actions\SavingsPlans;

use App\DataTransferObjects\SavingsPlans\DeductFromBalanceDto;

class DeductFromBalanceAction
{
    public function __invoke(DeductFromBalanceDto $dto)
    {
        if ($dto->date->isNowOrPast()) {
            //change balance of savings plan
            $dto->savingsPlan->decrement('balance', $dto->amount);

            //change balance of wallet/card
            $dto->account->increment('balance', $dto->amount);
        }
    }
}
