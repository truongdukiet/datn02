<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Cần thiết để sử dụng DB::raw()

return new class extends Migration
{
    /**
     * Chạy các migrations.
     */
    public function up(): void
    {
        Schema::create('productvariants', function (Blueprint $table) {
            $table->increments('ProductVariantID'); // Khóa chính tự tăng
            $table->integer('ProductID'); // Khóa ngoại đến bảng products, NOT NULL
            $table->integer('Sku')->comment('SKU của biến thể'); // SKU, NOT NULL
            $table->integer('Price')->comment('Giá của biến thể'); // Giá, NOT NULL
            $table->integer('Stock')->comment('Số lượng tồn kho'); // Tồn kho, NOT NULL

            // `created_at` và `Update_at` theo định dạng của bạn
            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP')); // Mặc định thời gian hiện tại
            $table->dateTime('Update_at')->default(DB::raw('CURRENT_TIMESTAMP'))->useCurrentOnUpdate(); // Mặc định và cập nhật khi có thay đổi

            // Định nghĩa khóa ngoại cho ProductID
            // Đảm bảo bảng `products` đã tồn tại trước khi chạy migration này.
            $table->foreign('ProductID')
                  ->references('ProductID')
                  ->on('products')
                  ->onDelete('cascade'); // Tùy chọn: Xóa biến thể nếu sản phẩm bị xóa
        });
    }

    /**
     * Hoàn tác các migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productvariants');
    }
};
