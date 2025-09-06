<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    use HasFactory;

    protected $table = 'product_reviews';
    protected $primaryKey = 'ReviewID';

    protected $fillable = [
        'ProductID',
        'UserID',
        'Star_rating',
        'Comment',
        'Image',
        'Create_at',
        'Status',
    ];

    const CREATED_AT = 'Create_at';
    const UPDATED_AT = null;

    protected $casts = [
        'Status' => 'boolean',
        'Create_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }
}
