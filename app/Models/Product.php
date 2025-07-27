<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Product
 *
 * Model này đại diện cho bảng 'products' trong cơ sở dữ liệu.
 * Nó định nghĩa các thuộc tính của sản phẩm và mối quan hệ với các bảng khác.
 */
class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;

    protected $fillable = [
        'CategoryID', 
        'Name', 
        'Description', 
        'Image', 
        'base_price', 
        'Status', 
        'Create_at', 
        'Update_at'
    ];

    /**
     * Định nghĩa mối quan hệ với Category.
     * Một sản phẩm thuộc về một danh mục.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'CategoryID', 'CategoryID');
    }

    /**
     * Định nghĩa mối quan hệ với ProductVariant.
     * Một sản phẩm có thể có nhiều biến thể.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'ProductID', 'ProductID');
    }

    /**
     * Định nghĩa mối quan hệ với Review.
     * Một sản phẩm có thể có nhiều đánh giá.
     */
    public function reviews()
    {
        return $this->hasManyThrough(
            \App\Models\Review::class,
            \App\Models\ProductVariant::class,
            'ProductID',           // Foreign key on ProductVariant table...
            'ProductVariantID',    // Foreign key on Review table...
            'ProductID',           // Local key on Product table...
            'ProductVariantID'     // Local key on ProductVariant table...
        );
    }

    /**
     * Định nghĩa mối quan hệ với FavoriteProduct.
     * Một sản phẩm có thể được yêu thích bởi nhiều người dùng.
     */
    public function favorites()
    {
        return $this->hasMany(FavoriteProduct::class, 'ProductID', 'ProductID');
    }

    /**
     * Định nghĩa mối quan hệ với OrderDetail.
     * Một sản phẩm có thể xuất hiện trong nhiều chi tiết đơn hàng.
     */
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'ProductID', 'ProductID');
    }
}
