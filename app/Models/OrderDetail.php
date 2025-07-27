<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    // Khai báo đúng tên bảng trong database
    protected $table = 'orderdetail';
    protected $primaryKey = 'OrderDetailID';
    public $timestamps = false; // Vì bảng không có created_at, updated_at

    protected $fillable = [
        'OrderID',
        'ProductVariantID',
        'Quantity',
        'Unit_price',
        'Subtotal',
    ];

    // Mỗi chi tiết đơn hàng thuộc về một đơn hàng
    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }

    // Mỗi chi tiết đơn hàng thuộc về một biến thể sản phẩm
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'ProductVariantID', 'ProductVariantID');
    }
}
