<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductVariant;

class CartItem extends Model
{
    protected $table = 'cart_items';
    protected $primaryKey = 'CartItemID';
    public $timestamps = false;

    protected $fillable = [
        'CartID',
        'ProductVariantID',
        'Quantity',
        'Create_at',
        'Update_at',
    ];

    // Một cart_item thuộc về một giỏ hàng
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'CartID', 'CartID');
    }

    // Một cart_item thuộc về một product_variant
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'ProductVariantID', 'ProductVariantID');
    }
}
