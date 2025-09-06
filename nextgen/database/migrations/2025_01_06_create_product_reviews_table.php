<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id('ReviewID');
            $table->unsignedBigInteger('ProductID');
            $table->unsignedBigInteger('UserID');
            $table->integer('Star_rating')->comment('1-5 stars');
            $table->text('Comment')->nullable();
            $table->string('Image')->nullable();
            $table->timestamp('Create_at')->useCurrent();
            $table->tinyInteger('Status')->default(1)->comment('1: active, 0: inactive');
            
            $table->foreign('ProductID')->references('ProductID')->on('products')->onDelete('cascade');
            $table->foreign('UserID')->references('UserID')->on('users')->onDelete('cascade');
            
            $table->index(['ProductID', 'Status']);
            $table->index(['UserID']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_reviews');
    }
};
