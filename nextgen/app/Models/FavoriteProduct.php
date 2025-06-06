<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteProduct extends Model
{
    protected $primaryKey = 'favoriteproductid';
    protected $fillable = [
        'userid',
        'productid',
        'created_at'
        ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
