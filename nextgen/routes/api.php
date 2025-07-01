<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\VariantAttributeController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\Cart; // Đảm bảo import đúng Controller của giỏ hàng
use App\Http\Controllers\FavoriteProductController; // Thêm dòng này để import FavoriteProductController
use App\Http\Controllers\ReviewController; // Thêm dòng này để import ReviewController

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

Route::apiResource('product_variants', ProductVariantController::class);
Route::apiResource('variant_attributes', VariantAttributeController::class);
Route::apiResource('attributes', AttributeController::class);

// Nhóm các route liên quan đến giỏ hàng dưới tiền tố 'cart'
Route::prefix('cart')->group(function () {
    Route::post('add', [Cart::class, 'addToCart']); // Thêm sản phẩm vào giỏ hàng
    Route::get('view', [Cart::class, 'viewCart']);  // Xem giỏ hàng
    Route::put('update', [Cart::class, 'updateCartItem']); // Cập nhật số lượng sản phẩm
    Route::delete('remove', [Cart::class, 'removeFromCart']); // Xóa một sản phẩm
    Route::post('clear', [Cart::class, 'clearCart']); // Xóa sạch giỏ hàng
});

// Thêm các API routes cho Favorite Products vào đây
Route::prefix('favorite-products')->group(function () {
    // Lấy tất cả sản phẩm yêu thích của một người dùng theo UserID
    // Phương thức: GET
    // URL ví dụ: /api/favorite-products/1
    Route::get('/{userId}', [FavoriteProductController::class, 'index']);

    // Thêm một sản phẩm vào danh sách yêu thích
    // Phương thức: POST
    // URL ví dụ: /api/favorite-products
    // Body (JSON): {"UserID": 1, "ProductVariantID": 101}
    Route::post('/', [FavoriteProductController::class, 'store']);

    // Xóa một sản phẩm khỏi danh sách yêu thích
    // Phương thức: DELETE
    // URL ví dụ: /api/favorite-products
    // Body (JSON): {"UserID": 1, "ProductVariantID": 101}
    Route::delete('/', [FavoriteProductController::class, 'destroy']);

    // (Tùy chọn) Nếu bạn muốn xóa bằng FavoriteProductID trực tiếp qua URL,
    // hãy uncomment dòng dưới đây và nhớ uncomment destroyById trong controller:
    // Route::delete('/{favoriteProductId}', [FavoriteProductController::class, 'destroyById']);
});

// Thêm các API routes cho Reviews vào đây
// apiResource sẽ tự động tạo các route sau:
// GET     /api/reviews           -> index (Lấy tất cả hoặc lọc)
// POST    /api/reviews           -> store (Thêm mới)
// GET     /api/reviews/{review}  -> show (Lấy chi tiết 1 review)
// PUT/PATCH /api/reviews/{review} -> update (Cập nhật)
// DELETE /api/reviews/{review}   -> destroy (Xóa)
Route::apiResource('reviews', ReviewController::class);
