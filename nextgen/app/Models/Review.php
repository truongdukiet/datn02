<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Nên thêm nếu bạn muốn dùng factory
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory; // Kích hoạt tính năng factory nếu cần

    protected $table = 'review'; // Tên bảng trong database của bạn là 'review' (viết thường)
    protected $primaryKey = 'ReviewID'; // Khóa chính của bảng bạn là 'ReviewID' (viết hoa các chữ cái đầu)

    // Các cột có thể được gán giá trị hàng loạt (mass assignable)
    // Đảm bảo tên cột khớp chính xác với tên trong database (có phân biệt hoa/thường)
    protected $fillable = [
        'OrderDetailID',    // Cột OrderDetailID
        'ProductVariantID', // Cột này là ProductVariantID, không phải ProductID như bạn viết
        'UserID',           // Cột UserID
        'Star_rating',      // Cột Star_rating
        'Comment',          // Cột Comment
        'Image',            // Cột Image (bị thiếu trong fillable của bạn)
        'Create_at',        // Cột thời gian tạo là 'Create_at' (viết hoa chữ C và a)
        'Status',           // Cột Status (bị thiếu trong fillable của bạn)
    ];

    // Cấu hình timestamps vì tên cột trong DB không phải là 'created_at'/'updated_at' mặc định của Laravel.
    const CREATED_AT = 'Create_at'; // Chỉ định cột thời gian tạo
    const UPDATED_AT = null;        // Bảng 'review' trong SQL dump của bạn không có cột 'updated_at', nên ta tắt nó đi.

    // Tùy chọn: Định nghĩa cách các thuộc tính được chuyển đổi kiểu dữ liệu
    // Ví dụ: `Status` là tinyint(1) trong DB, có thể muốn đọc nó như boolean
    // protected $casts = [
    //     'Status' => 'boolean',
    //     'Create_at' => 'datetime', // Đảm bảo Laravel xử lý Create_at thành đối tượng Carbon
    // ];

    /**
     * Lấy ProductVariant mà đánh giá này thuộc về.
     * Database của bạn liên kết Review với ProductVariantID, không phải ProductID trực tiếp.
     */
// Trong Model Review
public function productVariant()
{
    return $this->belongsTo(ProductVariant::class, 'ProductVariantID', 'ProductVariantID');
}

public function user()
{
    return $this->belongsTo(User::class, 'UserID', 'UserID');
}

    /**
     * Lấy OrderDetail mà đánh giá này thuộc về (nếu có).
     */
 

// Trong model OrderDetail
public function reviews()
{
    return $this->hasMany(Review::class, 'OrderDetailID', 'OrderDetailID');
}
public function orderDetail()
{
    return $this->belongsTo(OrderDetail::class, 'OrderDetailID', 'OrderDetailID');
}
}
