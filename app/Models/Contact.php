<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $appends = ['typeName'];

    /** @use HasFactory<\Database\Factories\ContactFactory> */
    use HasFactory;

    protected $guarded = [];

    public function getTypeNameAttribute()
    {
        return class_basename($this);
    }
}
