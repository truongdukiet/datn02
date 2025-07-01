<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\VariantAttributeController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\Cart;
use App\Http\Controllers\FavoriteProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Các API Resource tự động tạo các route CRUD
Route::apiResource('product_variants', ProductVariantController::class);
Route::apiResource('variant_attributes', VariantAttributeController::class);
Route::apiResource('attributes', AttributeController::class); // <-- Dòng này đã được sửa!

// Nhóm các route liên quan đến giỏ hàng
Route::prefix('cart')->group(function () {
    Route::post('add', [Cart::class, 'addToCart']);
    Route::get('view', [Cart::class, 'viewCart']);
    Route::put('update', [Cart::class, 'updateCartItem']);
    Route::delete('remove', [Cart::class, 'removeFromCart']);
    Route::post('clear', [Cart::class, 'clearCart']);
});

// Nhóm các API routes cho Sản phẩm yêu thích
Route::prefix('favorite-products')->group(function () {
    Route::get('/{userId}', [FavoriteProductController::class, 'index']);
    Route::post('/', [FavoriteProductController::class, 'store']);
    Route::delete('/', [FavoriteProductController::class, 'destroy']);
    // (Tùy chọn) Nếu bạn muốn xóa bằng FavoriteProductID trực tiếp qua URL,
    // hãy uncomment dòng dưới đây và nhớ uncomment destroyById trong controller:
    // Route::delete('/{favoriteProductId}', [FavoriteProductController::class, 'destroyById']);
});

// API Resource cho Đánh giá (Reviews)
Route::apiResource('reviews', ReviewController::class);

// Route API cụ thể để ReactJS lấy danh sách sản phẩm
Route::get('/products', [ProductController::class, 'indexApi']);
