<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $appends = ['typeName', 'is_expired'];
    use HasFactory;

    protected $dates = ['expiry_date'];

    protected $guarded = [];

    public function getTypeNameAttribute()
    {
        return class_basename($this);
    }

    public function getIsExpiredAttribute(): bool
    {
        return now()->greaterThan($this->expiry_date);
    }
}
