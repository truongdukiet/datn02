<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'value',
        'quantity',
        'update_at',
        'created_at',
        'status',
        'description',
        'expiry_date'
    ];

    /**
     * Get the orders that used this voucher.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
