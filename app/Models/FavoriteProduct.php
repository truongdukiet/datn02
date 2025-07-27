<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Đảm bảo dòng này có nếu bạn dùng factories

class FavoriteProduct extends Model
{
    use HasFactory; // Đảm bảo dòng này có nếu bạn dùng factories

    // Tên bảng trong cơ sở dữ liệu
    // Laravel mặc định sẽ suy luận 'favorite_products' từ 'FavoriteProduct' model,
    // nhưng để tường minh và đảm bảo, bạn có thể định nghĩa nó.
    protected $table = 'favorite_products';

    // Định nghĩa khóa chính của bảng.
    // Tên cột khóa chính trong DB của bạn là 'FavoriteProductID'.
    protected $primaryKey = 'FavoriteProductID';

    // Các cột có thể được gán giá trị hàng loạt (mass assignable).
    // Đảm bảo tên cột khớp chính xác với tên trong database (có phân biệt hoa/thường).
    protected $fillable = [
        'UserID',
        'ProductVariantID', // Đã sửa từ 'productid' sang 'ProductVariantID'
        'Create_at',        // Đã sửa từ 'created_at' sang 'Create_at'
    ];

    // Cấu hình timestamps vì tên cột trong DB không phải là 'created_at'/'updated_at' mặc định của Laravel.
    // 'Create_at' là cột thời gian tạo.
    const CREATED_AT = 'Create_at';
    // Bảng 'favorite_products' của bạn không có cột 'updated_at' được tự động cập nhật,
    // nên ta đặt UPDATED_AT là null để Laravel không cố gắng cập nhật cột này.
    const UPDATED_AT = null;
    // Nếu bạn có cột 'Update_at' và muốn Laravel quản lý nó, hãy đặt:
    // const UPDATED_AT = 'Update_at';
    // protected $dates = ['Create_at']; // Tùy chọn: Laravel sẽ tự động chuyển đổi thành đối tượng Carbon

    // Định nghĩa mối quan hệ với bảng 'users'.
    // 'UserID' là khóa ngoại trong bảng 'favorite_products'.
    // 'UserID' là khóa chính trong bảng 'users'.
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    // Định nghĩa mối quan hệ với bảng 'productvariants'.
    // Bảng 'favorite_products' của bạn liên kết đến 'ProductVariantID', không phải 'ProductID' trực tiếp.
    // 'ProductVariantID' là khóa ngoại trong bảng 'favorite_products'.
    // 'ProductVariantID' là khóa chính trong bảng 'productvariants'.
    public function productVariant() // Đã đổi tên phương thức từ 'product' sang 'productVariant'
    {
        return $this->belongsTo(ProductVariant::class, 'ProductVariantID', 'ProductVariantID');
    }
}
