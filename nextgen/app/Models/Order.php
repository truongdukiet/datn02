<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $primaryKey = 'OrderID';
    protected $fillable = [
        'InvoiceCode',
        'UserID',
        'VoucherID',
        'PaymentID',
        'Status',
        'Total_amount',
        'Receiver_name',
        'Receiver_phone',
        'Shipping_address',
        'Create_at',
        'Update_at',
    ];

    const CREATED_AT = 'Create_at';
    const UPDATED_AT = 'Update_at';

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

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'orderid', 'orderid');
    }

}
