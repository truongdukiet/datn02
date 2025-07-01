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

    public function category()
    {
        return $this->belongsTo(\App\Models\Category::class, 'CategoryID', 'CategoryID');
    }

    public function variants()
    {
        return $this->hasMany(\App\Models\ProductVariant::class, 'ProductID', 'ProductID');
    }
}
