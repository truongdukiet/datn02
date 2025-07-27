<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_categories_table.php
// Đây là tệp migration để tạo bảng 'categories' trong cơ sở dữ liệu.

use Illuminate\Database\Migrations\Migration; // Import class cơ sở cho Migration.
use Illuminate\Database\Schema\Blueprint; // Import Blueprint để định nghĩa cấu trúc các cột của bảng.
use Illuminate\Support\Facades\Schema; // Import Schema để tương tác với schema cơ sở dữ liệu (tạo, xóa bảng).

class CreateCategoriesTable extends Migration // Định nghĩa class Migration của chúng ta.
{
    /**
     * Chạy các migrations.
     * Phương thức 'up' được gọi khi bạn chạy `php artisan migrate`. Nó chứa logic để tạo bảng.
     *
     * @return void
     */
    public function up() // Phương thức này sẽ được thực thi khi bạn chạy migration.
    {
        // Tạo bảng 'categories'
        Schema::create('categories', function (Blueprint $table) { // Sử dụng Schema::create để tạo một bảng mới.
            $table->id(); // Tạo cột 'id' tự động tăng (auto-incrementing) và là khóa chính (primary key).
            $table->string('name')->unique(); // Tạo cột 'name' kiểu chuỗi (VARCHAR), và đảm bảo giá trị là duy nhất.
            $table->timestamps(); // Tạo hai cột 'created_at' và 'updated_at' tự động, kiểu TIMESTAMP.
                                  // Laravel sẽ tự động quản lý các cột này khi bản ghi được tạo hoặc cập nhật.
        });
    }

    /**
     * Đảo ngược các migrations.
     * Phương thức 'down' được gọi khi bạn chạy `php artisan migrate:rollback`. Nó chứa logic để xóa bảng.
     *
     * @return void
     */
    public function down() // Phương thức này sẽ được thực thi khi bạn hoàn tác migration.
    {
        // Xóa bảng 'categories' nếu nó tồn tại
        Schema::dropIfExists('categories'); // Xóa bảng 'categories' khỏi cơ sở dữ liệu.
    }
}
