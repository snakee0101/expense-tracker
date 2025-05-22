<?php

namespace App\Enums;

enum TransactionStatus: int
{
    use EnumToSelectOptions;

    case Pending = 1;
    case Completed = 2;
    case Cancelled = 3;

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public static function fromCaseName($caseName)
    {
        return match ($caseName) {
            'Pending' => self::Pending,
            'Completed' => self::Completed,
            'Cancelled' => self::Cancelled,
        };
    }
}
