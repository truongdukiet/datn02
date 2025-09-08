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
        'Pending_at',
        'Processing_at',
        'Shipping_at',
        'Completed_at',
        'Cancelled_at',
        'Update_at',
    ];

    const CREATED_AT = 'Pending_at';
    const UPDATED_AT = 'Update_at';

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'UserID', 'UserID');
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

    public function voucher()
    {
        return $this->belongsTo(\App\Models\Voucher::class, 'VoucherID', 'VoucherID');
    }

    public function paymentGateway()
    {
        return $this->belongsTo(\App\Models\PaymentGateway::class, 'PaymentID', 'PaymentID');
    }

}
