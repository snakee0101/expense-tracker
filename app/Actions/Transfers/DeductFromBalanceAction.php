<?php

namespace App\Actions\Transfers;

use App\DataTransferObjects\Transfers\DeductFromBalanceDto;

/**
 * Changes balance of wallet/card where you transfer money from
 **/
class DeductFromBalanceAction
{
    public function __invoke(DeductFromBalanceDto $dto)
    {
        if ($dto->date->isNowOrPast()) {
            $dto->source->decrement('balance', $dto->amount);
        }
    }
}
