<?php

namespace App\DataTransferObjects\Transfers;

use Carbon\Carbon;

final readonly class TransferTransactionDto
{
    public function __construct(
        public string $name,
        public Carbon $date,
        public float $amount,
        public string|null $note,
        public int $category_id,
        public int $source_id,
        public string $source_type,
        public int $contact_id
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            name: $request->name,
            date: Carbon::parse("{$request->date} {$request->time}"),
            amount: (float) $request->amount,
            note: $request->note,
            category_id: (int) $request->category_id,
            source_id: (int) $request->source_id,
            source_type: $request->source_type,
            contact_id: (int) $request->contact_id
        );
    }
}
