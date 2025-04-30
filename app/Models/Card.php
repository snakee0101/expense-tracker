<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $appends = ['typeName'];
    use HasFactory;

    protected $dates = ['expiry_date'];

    protected $fillable = ['user_id', 'name', 'card_number', 'expiry_date', 'balance'];

    public function getTypeNameAttribute()
    {
        return class_basename($this);
    }
}
