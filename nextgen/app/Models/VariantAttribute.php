<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{
    use HasFactory;

    protected $table = 'variant_attributes';

    protected $fillable = [
        'ProductVariantID',
        'AttributeID',
        'value',
    ];

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'ProductVariantID');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'AttributeID');
    }
}