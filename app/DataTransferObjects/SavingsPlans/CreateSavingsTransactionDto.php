<?php

namespace App\DataTransferObjects\SavingsPlans;

use Carbon\Carbon;

final readonly class CreateSavingsTransactionDto
{
    public function __construct(
        public string $name,
        public bool $isWithdraw,
        public Carbon $date,
        public float $amount,
        public string|null $note,
        public int $categoryId,
        public int $relatedAccountId,
        public string $relatedAccountType,
        public int $savingsPlanId
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            name: $request->name,
            isWithdraw: $request->boolean('is_withdraw'),
            date: Carbon::parse("{$request->date} {$request->time}"),
            amount: (float) $request->amount,
            note: $request->note,
            categoryId: $request->category_id,
            relatedAccountId: (int) $request->related_account_id,
            relatedAccountType: $request->related_account_type,
            savingsPlanId: (int) $request->savings_plan_id,
        );
    }
}
