<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Đảm bảo đã import Trait này
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable; // Thêm HasApiTokens vào đây

    protected $table = 'users'; // Chỉ định tên bảng rõ ràng
    protected $primaryKey = 'UserID'; // Đảm bảo khớp với tên cột trong DB
    public $timestamps = false; // Tắt timestamps tự động vì tên cột khác (Created_at, Updated_at)


    const CREATED_AT = 'Created_at';
    const UPDATED_AT = 'Updated_at';

    protected $fillable = [
        'Username',
        'Password',
        'Email',
        'Role',
        'Fullname',
        'Phone',
        'Address',
        'Status',
        'remember_token',
        'email_verified_at',
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

    // Đảm bảo các hàm xác thực sử dụng đúng trường
    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function getEmailForPasswordReset()
    {
        return $this->Email;
    }

    public function getEmailForVerification()
    {
        return $this->Email;
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\CustomVerifyEmail);
    }
}
