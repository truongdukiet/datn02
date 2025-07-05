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
protected $table = 'products';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;

    protected $fillable = ['CategoryID', 'Name', 'Description', 'Image', 'base_price', 'Status', 'Create_at', 'Update_at'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'CategoryID', 'CategoryID');
    use HasFactory;

    // Tên bảng nếu khác với tên số nhiều của model (mặc định là 'products')
    // protected $table = 'products';

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
    ];

    /**
     * Định nghĩa mối quan hệ với Category.
     * Một sản phẩm thuộc về một danh mục.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryid', 'categoryid');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'ProductID', 'ProductID');
    }


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
}
