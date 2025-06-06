<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $primaryKey = 'orderdetailid';
    protected $fillable = [
        'orderid',
        'productid',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    /**
     * Get the order that owns the order detail.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product associated with the order detail.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
