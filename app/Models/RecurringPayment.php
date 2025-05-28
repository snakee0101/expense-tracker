<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class RecurringPayment extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'period_starting_date' => 'datetime:Y-m-d'
        ];
    }

    public function destination(): MorphTo
    {
        return $this->morphTo('destination');
    }

    public function category(): HasOne
    {
        return $this->hasOne(TransactionCategory::class, 'id', 'category_id');
    }
}
