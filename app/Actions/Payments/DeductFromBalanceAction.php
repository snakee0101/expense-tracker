<?php

namespace App\Actions\Payments;

use App\DataTransferObjects\Payments\DeductFromBalanceDto;

class DeductFromBalanceAction
{
    public function __invoke(DeductFromBalanceDto $dto)
    {
        if ($dto->date->isNowOrPast()) {
            $dto->source->decrement('balance', $dto->amount);
        }
    }
}
