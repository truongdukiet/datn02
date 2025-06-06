<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $primaryKey = 'productid';
    protected $fillable = [
        'categoryid',
        'name',
        'description',
        'price',
        'image',
        'stock',
        'status',
        'created_at',
        'updated_at',
    ];
}
