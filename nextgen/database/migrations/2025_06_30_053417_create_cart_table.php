<?php

// Dòng này báo cho PHP biết rằng chúng ta sẽ sử dụng các lớp (classes) này.
// Mỗi 'use' là như việc bạn nhập một công cụ đặc biệt vào để sử dụng trong file này.
use Illuminate\Database\Migrations\Migration; // Đây là lớp cơ bản mà tất cả các file migration phải kế thừa.
use Illuminate\Database\Schema\Blueprint;    // Blueprint giúp bạn định nghĩa cấu trúc bảng (ví dụ: thêm cột, kiểu dữ liệu).
use Illuminate\Support\Facades\Schema;       // Lớp Schema cung cấp các phương thức để tương tác với cơ sở dữ liệu (tạo bảng, xóa bảng, sửa bảng).

// Đây là phần chính của file migration.
// return new class extends Migration nghĩa là bạn đang tạo một lớp mới (class)
// mà nó không có tên cụ thể (anonymous class) và nó kế thừa từ lớp Migration.
// Kế thừa giúp nó có tất cả các tính năng cơ bản của một migration.
return new class extends Migration
{
    /**
     * Run the migrations.
     * Phương thức 'up' được gọi khi bạn chạy lệnh 'php artisan migrate'.
     * Mục đích của nó là TẠO MỚI các bảng hoặc THÊM các cột vào bảng đã có.
     * Đây là nơi bạn định nghĩa cấu trúc bảng 'cart' của mình.
     */
    public function up(): void
    {
        // Schema::create('cart', function (Blueprint $table) { ... });
        // Lệnh này dùng để TẠO MỘT BẢNG MỚI trong cơ sở dữ liệu với tên là 'cart'.
        // Phần 'function (Blueprint $table)' là nơi bạn sẽ định nghĩa các cột của bảng 'cart'.
        // Biến $table đại diện cho bảng 'cart' mà bạn đang định nghĩa.
        Schema::create('cart', function (Blueprint $table) {
            // $table->id();
            // Lệnh này tạo một cột 'id' (khóa chính - Primary Key).
            // Mặc định nó sẽ là kiểu UNSIGNED BIGINT AUTO_INCREMENT PRIMARY KEY.
            // Điều này có nghĩa là mỗi bản ghi (dòng) trong bảng sẽ có một ID duy nhất, tự động tăng.
            $table->id();

            // $table->timestamps();
            // Lệnh này tạo ra hai cột đặc biệt: 'created_at' và 'updated_at'.
            // - 'created_at': Tự động lưu thời gian khi bản ghi này được tạo ra.
            // - 'updated_at': Tự động cập nhật thời gian khi bản ghi này được chỉnh sửa lần cuối.
            // Rất hữu ích để theo dõi lịch sử thay đổi của dữ liệu.
            $table->timestamps();

            // --- Bạn có thể thêm các cột khác vào đây, ví dụ: ---
            // $table->string('user_id'); // ID của người dùng sở hữu giỏ hàng
            // $table->string('product_id'); // ID của sản phẩm trong giỏ hàng
            // $table->integer('quantity')->default(1); // Số lượng sản phẩm, mặc định là 1
            // $table->decimal('price', 8, 2); // Giá sản phẩm, với 8 chữ số tổng cộng và 2 chữ số sau dấu thập phân
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Khóa ngoại liên kết với bảng 'users'
            // $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade'); // Khóa ngoại liên kết với bảng 'products'
        });
    }

    /**
     * Reverse the migrations.
     * Phương thức 'down' được gọi khi bạn chạy lệnh 'php artisan migrate:rollback'.
     * Mục đích của nó là ĐẢO NGƯỢC lại những gì phương thức 'up' đã làm.
     * Tức là, nếu 'up' tạo bảng, thì 'down' sẽ xóa bảng đó đi.
     * Điều này rất quan trọng để bạn có thể hoàn tác các thay đổi về cấu trúc cơ sở dữ liệu.
     */
    public function down(): void
    {
        // Schema::dropIfExists('cart');
        // Lệnh này dùng để XÓA BỎ BẢNG có tên là 'cart' khỏi cơ sở dữ liệu.
        // 'dropIfExists' có nghĩa là nó sẽ chỉ xóa nếu bảng đó tồn tại,
        // tránh gây lỗi nếu bạn cố gắng xóa một bảng không có.
        $table->dropIfExists('cart');
    }
};
