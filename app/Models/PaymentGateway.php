<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class PaymentGateway
 *
 * Model này đại diện cho bảng 'payment_gateway' trong cơ sở dữ liệu.
 * Nó định nghĩa các thuộc tính của cổng thanh toán và mối quan hệ với các bảng khác.
 */
class PaymentGateway extends Model
{
    use HasFactory;

    protected $table = 'payment_gateway';
    protected $primaryKey = 'PaymentID';
    public $timestamps = false;

    protected $fillable = [
        'Name'
    ];

    /**
     * Định nghĩa mối quan hệ với Order.
     * Một cổng thanh toán có thể được sử dụng trong nhiều đơn hàng.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'PaymentID', 'PaymentID');
    }


}
