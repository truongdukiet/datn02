<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('OrderID');
            $table->string('InvoiceCode')->unique();
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('VoucherID')->nullable();
            $table->unsignedBigInteger('PaymentID')->nullable();
            $table->string('Status')->default('Pending'); // Pending, Completed, Canceled
            $table->decimal('Total_amount', 15, 2);
            $table->string('Receiver_name');
            $table->string('Receiver_phone');
            $table->text('Shipping_address');
            $table->timestamp('Create_at')->nullable();
            $table->timestamp('Update_at')->nullable();

            $table->foreign('UserID')->references('UserID')->on('users')->onDelete('cascade');
            $table->foreign('VoucherID')->references('VoucherID')->on('vouchers')->onDelete('set null');
            $table->foreign('PaymentID')->references('PaymentID')->on('payment_gateways')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
