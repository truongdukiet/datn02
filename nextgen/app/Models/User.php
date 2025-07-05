<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Đảm bảo đã import Trait này

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // Thêm HasApiTokens vào đây

    protected $table = 'users'; // Chỉ định tên bảng rõ ràng
    protected $primaryKey = 'UserID'; // Đảm bảo khớp với tên cột trong DB
    public $timestamps = false; // Tắt timestamps tự động vì tên cột khác (Created_at, Updated_at)

    protected $fillable = [
        'Username', // Đảm bảo khớp với tên cột trong DB
        'Password', // Đảm bảo khớp với tên cột trong DB
        'Email',    // Đảm bảo khớp với tên cột trong DB
        'Role',     // Đảm bảo khớp với tên cột trong DB
        'Fullname', // Đảm bảo khớp với tên cột trong DB (Fullname thay vì full_name)
        'Phone',    // Đảm bảo khớp với tên cột trong DB
        'Address',  // Đảm bảo khớp với tên cột trong DB
        'Status',   // Đảm bảo khớp với tên cột trong DB
        'Created_at', // Đảm bảo khớp với tên cột trong DB
        'Updated_at', // Đảm bảo khớp với tên cột trong DB
    ];

    protected $hidden = [
        'Password', // Đảm bảo khớp với tên cột trong DB
        'remember_token',
    ];

    protected $casts = [ // Sử dụng thuộc tính $casts thay vì phương thức casts() để nhất quán
        'email_verified_at' => 'datetime',
        'Password' => 'hashed', // Đảm bảo khớp với tên cột trong DB
    ];

    /**
     * Định nghĩa mối quan hệ với Cart.
     * Một User có nhiều Cart items.
     */
    public function cartItems()
    {
        return $this->hasMany(Cart::class, 'UserID', 'UserID');
    }
}
