<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $appends = ['typeName'];

    use HasFactory;

    protected $guarded = [];

    public function getTypeNameAttribute()
    {
        return class_basename($this);
    }
}
