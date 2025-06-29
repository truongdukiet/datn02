<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\VariantAttributeController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\Cart; // Đảm bảo import đúng Controller của giỏ hàng

Route::apiResource('product_variants', ProductVariantController::class);
Route::apiResource('variant_attributes', VariantAttributeController::class);
Route::apiResource('attributes', AttributeController::class);

// Nhóm các route liên quan đến giỏ hàng dưới tiền tố 'cart'
Route::prefix('cart')->group(function () {
    Route::post('add', [Cart::class, 'addToCart']); // Thêm sản phẩm vào giỏ hàng
    Route::get('view', [Cart::class, 'viewCart']);  // Xem giỏ hàng
    Route::put('update', [Cart::class, 'updateCartItem']); // Cập nhật số lượng sản phẩm
    Route::delete('remove', [Cart::class, 'removeFromCart']); // Xóa một sản phẩm
    Route::post('clear', [Cart::class, 'clearCart']); // Xóa sạch giỏ hàng
});


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

