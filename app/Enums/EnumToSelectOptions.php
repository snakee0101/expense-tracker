<?php

namespace App\Enums;

trait EnumToSelectOptions
{
    /**
     * Converts list of all enum cases to array [case value => case label] that could be passed to <select>
     * */
    public static function toSelectOptions(): array
    {
        return array_reduce(self::cases(), function ($cases, self $case) {
            $cases[$case->value] = $case->label();

            return $cases;
        }, []);
    }
}
