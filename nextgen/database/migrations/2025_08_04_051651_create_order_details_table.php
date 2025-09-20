<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orderdetail', function (Blueprint $table) {
            $table->id('OrderDetailID');
            $table->unsignedBigInteger('OrderID');
            $table->unsignedBigInteger('ProductVariantID');
            $table->integer('Quantity');
            $table->decimal('Unit_price', 15, 2);
            $table->decimal('Subtotal', 15, 2);

            $table->foreign('OrderID')->references('OrderID')->on('orders')->onDelete('cascade');
            $table->foreign('ProductVariantID')->references('ProductVariantID')->on('productvariants')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orderdetail');
    }
};
