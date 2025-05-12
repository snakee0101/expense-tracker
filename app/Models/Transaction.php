<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaction extends Model
{
    protected function casts(): array
    {
        return [
            'status' => TransactionStatus::class,
            'date' => 'datetime'
        ];
    }

    protected $guarded = [];

    public function category(): HasOne
    {
        return $this->hasOne(TransactionCategory::class, 'id', 'category_id');
    }

    public function source(): MorphTo
    {
        return $this->morphTo('source');
    }

    public function destination(): MorphTo
    {
        return $this->morphTo('destination');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }
}
