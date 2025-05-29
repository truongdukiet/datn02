<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'invoicecode',
        'userid',
        'voucherid',
        'paymentid',
        'order_date',
        'status',
        'total_amount',
        'receiver_name',
        'receiver_phone',
        'shipping_address',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product associated with the order.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
