<?php
// File: quanly-thuoc-tinh-be/database/migrations/YYYY_MM_DD_HHMMSS_create_attributes_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Phương thức 'up' được gọi khi bạn chạy 'php artisan migrate'.
     * Nó định nghĩa cách tạo (hoặc thay đổi) bảng trong database.
     */
    public function up()
    {
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();          // Tạo cột 'id' (BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY)
            $table->string('name'); // Tạo cột 'name' kiểu chuỗi (VARCHAR)
            $table->timestamps();  // Tạo 2 cột: 'created_at' và 'updated_at' (DATETIME)
        });
    }

    /**
     * Phương thức 'down' được gọi khi bạn chạy 'php artisan migrate:rollback'.
     * Nó định nghĩa cách hoàn tác các thay đổi được thực hiện trong 'up'.
     */
    public function down()
    {
        Schema::dropIfExists('attributes'); // Xóa bảng 'attributes' nếu nó tồn tại
    }
};
