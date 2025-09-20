<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'orderdetail';
    protected $primaryKey = 'OrderDetailID';

    protected $fillable = [
        'OrderID',
        'ProductVariantID',
        'Quantity',
        'Unit_price',
        'Subtotal',
    ];

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'ProductVariantID', 'ProductVariantID');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'ProductVariantID', 'ProductVariantID');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }
}