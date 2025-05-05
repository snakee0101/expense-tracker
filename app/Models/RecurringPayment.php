<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class RecurringPayment extends Model
{
    protected $guarded = [];

    public function source(): MorphTo
    {
        return $this->morphTo('source');
    }
}
