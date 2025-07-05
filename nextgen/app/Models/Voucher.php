<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $primaryKey = 'VoucherID';
    protected $fillable = [
        'Code',
        'Value',
        'Quantity',
        'Update_at',
        'Create_at',
        'Status',
        'Description',
        'Expiry_date'
    ];
    protected $table = 'voucher';
    public $timestamps = false;

    /**
     * Get the orders that used this voucher.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
