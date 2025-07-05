<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductVariant; // Import ProductVariant Model
use App\Models\User; // Import User Model

class Cart extends Model
{
    // Tên bảng trong cơ sở dữ liệu
    protected $table = 'cart';

    // Khóa chính của bảng
    protected $primaryKey = 'CartID';

    // Tắt Laravel's auto-timestamps nếu bạn muốn quản lý thủ công
    // Hoặc chỉ định tên cột nếu chúng khác 'created_at' và 'updated_at'
    public $timestamps = false; // Tắt tự động quản lý timestamps

    // Định nghĩa các cột có thể gán hàng loạt (mass assignable)
    protected $fillable = [
        'UserID',
        'ProductVariantID',
        'Quantity',
        'Create_at', // Tên cột tạo thủ công
        'Update_at', // Tên cột cập nhật thủ công
    ];

    /**
     * Định nghĩa mối quan hệ với ProductVariant.
     * Một mục trong giỏ hàng thuộc về một ProductVariant.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'ProductVariantID', 'ProductVariantID');
    }

    /**
     * Định nghĩa mối quan hệ với User.
     * Một giỏ hàng thuộc về một User.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }
}
