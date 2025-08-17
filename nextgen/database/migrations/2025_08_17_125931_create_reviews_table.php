<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('ReviewID');                  // khóa chính
            $table->unsignedBigInteger('OrderDetailID');
            $table->unsignedBigInteger('ProductVariantID');
            $table->unsignedBigInteger('UserID');
            $table->unsignedTinyInteger('Star_rating');
            $table->text('Comment')->nullable();
            $table->string('Image')->nullable();
            $table->boolean('Status')->nullable();
            $table->timestamps();

            // Nếu muốn ràng buộc khóa ngoại:
            // $table->foreign('OrderDetailID')->references('OrderDetailID')->on('orderdetail')->onDelete('cascade');
            // $table->foreign('ProductVariantID')->references('ProductVariantID')->on('productvariants');
            // $table->foreign('UserID')->references('UserID')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
