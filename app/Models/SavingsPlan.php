<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingsPlan extends Model
{
    protected $appends = ['typeName'];

    /** @use HasFactory<\Database\Factories\SavingsPlanFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'due_date' => 'datetime'
    ];

    public function getTypeNameAttribute()
    {
        return class_basename($this);
    }
}
