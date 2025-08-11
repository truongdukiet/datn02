<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'product_id',
        'variant_id',
        'image',
        'is_main'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'ProductID');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id', 'ProductVariantID');
    }
}
