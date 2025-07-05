<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ProductVariant extends Model
{
    use HasFactory;

 protected $table = 'productvariants';
    protected $primaryKey = 'ProductVariantID';
    public $timestamps = false;

    protected $fillable = ['ProductID', 'Sku', 'Price', 'Stock', 'created_at', 'Update_at'];

    /**
     * Định nghĩa mối quan hệ với Product.
     * Một ProductVariant thuộc về một Product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }

    public function attributes()
    {
        return $this->hasMany(VariantAttribute::class, 'ProductVariantID', 'ProductVariantID');
    }
}
