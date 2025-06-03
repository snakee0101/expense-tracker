<?php

namespace App\DataTransferObjects;

use App\Http\Requests\IncomeExpenseRequest;

final readonly class IncomeExpenseDTO
{
    public function __construct(
        public string $name,
        public string $date, // e.g. "2025-06-03"
        public string $time, // e.g. "14:30"
        public float $amount,
        public bool $is_income,
        public string|null $note,
        public string $destination_type,
        public int $destination_id,
        public int $category_id
    ) {}

    public static function fromRequest(IncomeExpenseRequest $request): self
    {
        return new self(
            name: $request->name,
            date: $request->date,
            time: $request->time,
            amount: (float) $request->amount,
            is_income: $request->boolean('is_income'),
            note: $request->note,
            destination_type: $request->destination_type,
            destination_id: (int) $request->destination_id,
            category_id: (int) $request->category_id,
        );
    }
}
