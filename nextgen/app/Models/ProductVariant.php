<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $table = 'product_variants';

    protected $fillable = [
        'ProductID',
        'Sku',
        'Price',
        'Stock',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID');
    }

    public function variantAttributes()
    {
        return $this->hasMany(VariantAttribute::class, 'ProductVariantID');
    }
}