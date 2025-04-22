<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingsPlan extends Model
{
    /** @use HasFactory<\Database\Factories\SavingsPlanFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'target_balance',
        'due_date',
        'savings_tips',
    ];

    protected $casts = [
        'due_date' => 'datetime'
    ];
}
