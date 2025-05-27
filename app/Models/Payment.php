<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $appends = ['typeName'];
    protected $guarded = [];

    public function paymentCategory()
    {
        return $this->belongsTo(PaymentCategory::class);
    }

    public function category()
    {
        return $this->belongsTo(TransactionCategory::class);
    }

    public function getTypeNameAttribute()
    {
        return class_basename($this);
    }
}
