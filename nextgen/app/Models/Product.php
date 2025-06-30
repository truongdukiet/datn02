<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
protected $table = 'products';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;

    protected $fillable = ['CategoryID', 'Name', 'Description', 'Image', 'base_price', 'Status', 'Create_at', 'Update_at'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'CategoryID', 'CategoryID');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'ProductID', 'ProductID');
    }
}
