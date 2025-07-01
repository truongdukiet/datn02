<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Thường được sử dụng cho factory

/**
 * Class Product
 *
 * Model này đại diện cho bảng 'products' trong cơ sở dữ liệu.
 * Nó định nghĩa các thuộc tính của sản phẩm và mối quan hệ với các bảng khác.
 */
class Product extends Model
{
    use HasFactory; // Kích hoạt tính năng factory để tạo dữ liệu mẫu

    // Tên bảng nếu khác với tên số nhiều của model (mặc định là 'products')
    // protected $table = 'products';

    // Định nghĩa khóa chính nếu nó không phải là 'id'
    protected $primaryKey = 'productid';

    // Cho phép gán hàng loạt (mass assignment) cho các cột này.
    // Điều này có nghĩa là bạn có thể tạo hoặc cập nhật một bản ghi
    // bằng cách truyền một mảng các thuộc tính vào phương thức create() hoặc update().
    protected $fillable = [
        'categoryid',
        'name',
        'description',
        'price',
        'image',
        'stock',
        'status',
        // 'created_at', // Laravel tự động quản lý created_at và updated_at nếu timestamps = true
        // 'updated_at',
    ];

    // Nếu bạn không muốn Laravel tự động quản lý created_at và updated_at,
    // bạn có thể đặt protected $timestamps = false;
    // Mặc định là true.

    // Các thuộc tính nên được ẩn khi chuyển đổi model thành mảng hoặc JSON.
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    // Các thuộc tính nên được chuyển đổi thành kiểu dữ liệu cụ thể.
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    //     'password' => 'hashed',
    // ];

    /**
     * Định nghĩa mối quan hệ với Category.
     * Một sản phẩm thuộc về một danh mục.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryid', 'categoryid');
    }

    // Bạn có thể thêm các mối quan hệ khác ở đây, ví dụ với ProductVariant, Review, v.v.
    // public function productVariants()
    // {
    //     return $this->hasMany(ProductVariant::class, 'productid', 'productid');
    // }

    // public function reviews()
    // {
    //     return $this->hasMany(Review::class, 'productid', 'productid');
    // }
}
