<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

 protected $table = 'productvariants';
    protected $primaryKey = 'ProductVariantID';
    public $timestamps = false;

    protected $fillable = ['ProductID', 'Sku', 'Price', 'Stock', 'created_at', 'Update_at'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }

    public function attributes()
    {
        return $this->hasMany(VariantAttribute::class, 'ProductVariantID', 'ProductVariantID');
    }
}