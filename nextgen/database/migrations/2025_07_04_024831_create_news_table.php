

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id(); // Tự động tạo cột 'id' (BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY)
            $table->string('title'); // Cột tiêu đề, kiểu chuỗi
            $table->string('slug')->unique(); // Cột slug, kiểu chuỗi, đảm bảo duy nhất
            $table->text('content'); // Cột nội dung, kiểu văn bản dài
            $table->string('image')->nullable(); // Cột ảnh đại diện, có thể null
            $table->unsignedBigInteger('author_id')->nullable(); // Khóa ngoại liên kết với UserID
            $table->string('status')->default('draft'); // Trạng thái bài viết (draft, published, v.v.)
            $table->timestamp('published_at')->nullable(); // Thời gian xuất bản
            $table->timestamps(); // Tự động tạo 'created_at' và 'updated_at'

            // Định nghĩa khóa ngoại
            $table->foreign('author_id')->references('UserID')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
