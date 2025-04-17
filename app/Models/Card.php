<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    protected $dates = ['expiry_date'];

    protected $fillable = ['user_id', 'name', 'card_number', 'expiry_date', 'balance'];
}
