<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class TransactionCategory extends Model
{
    use HasFactory;

    protected $appends = ['imageUrl'];

    protected $guarded = [];

    public function getImageUrlAttribute()
    {
        return Storage::url($this->image_path);
    }
}
