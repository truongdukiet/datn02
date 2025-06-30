<?php

// Dòng này báo cho PHP biết rằng chúng ta sẽ sử dụng các lớp (classes) này.
// Mỗi 'use' là như việc bạn nhập một công cụ đặc biệt vào để sử dụng trong file này.
use Illuminate\Database\Migrations\Migration; // Đây là lớp cơ bản mà tất cả các file migration phải kế thừa.
use Illuminate\Database\Schema\Blueprint;    // Blueprint giúp bạn định nghĩa cấu trúc bảng (ví dụ: thêm cột, kiểu dữ liệu).
use Illuminate\Support\Facades\Schema;      // Lớp Schema cung cấp các phương thức để tương tác với cơ sở dữ liệu (tạo bảng, xóa bảng, sửa bảng).

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
            // Dựa trên SQL dump bạn cung cấp, khóa chính của bảng `cart` là `CartID` (int(11) NOT NULL AUTO_INCREMENT)
            // Vì vậy, thay vì $table->id(); chúng ta sẽ dùng:
            $table->increments('CartID'); // Khóa chính CartID

            // $table->timestamps();
            // Lệnh này tạo ra hai cột đặc biệt: 'created_at' và 'updated_at'.
            // - 'created_at': Tự động lưu thời gian khi bản ghi này được tạo ra.
            // - 'updated_at': Tự động cập nhật thời gian khi bản ghi này được chỉnh sửa lần cuối.
            // Rất hữu ích để theo dõi lịch sử thay đổi của dữ liệu.
            // Dựa trên SQL dump của bạn, các cột thời gian là `Create_at` và `Update_at` (datetime)
            $table->dateTime('Create_at')->nullable(); // Có thể NULL theo SQL dump
            $table->dateTime('Update_at')->nullable(); // Có thể NULL theo SQL dump


            // --- Thêm các cột khác dựa trên SQL dump của bạn: ---
            // `UserID` int(11) DEFAULT NULL
            $table->unsignedInteger('UserID')->nullable();
            // `ProductVariantID` int(11) DEFAULT NULL
            $table->unsignedInteger('ProductVariantID')->nullable();
            // `Quantity` int(11) DEFAULT NULL
            $table->integer('Quantity')->nullable();

            // Định nghĩa khóa ngoại (Foreign Keys)
            // Liên kết UserID với bảng users
            $table->foreign('UserID')->references('UserID')->on('users')->onDelete('set null'); // onDelete('set null') vì UserID có thể DEFAULT NULL
            // Liên kết ProductVariantID với bảng productvariants
            $table->foreign('ProductVariantID')->references('ProductVariantID')->on('productvariants')->onDelete('set null'); // onDelete('set null') vì ProductVariantID có thể DEFAULT NULL
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
        Schema::dropIfExists('cart'); // Lỗi 'báo đỏ' là do bạn dùng $table ở đây, phải là Schema::dropIfExists
    }
};
