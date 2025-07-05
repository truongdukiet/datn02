<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\VariantAttributeController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\CategoryController;


use App\Http\Controllers\CartController; // Đảm bảo import đúng Controller của giỏ hàng
use App\Http\Controllers\FavoriteProductController; // Thêm dòng này để import FavoriteProductController
use App\Http\Controllers\ReviewController; // Thêm dòng này để import ReviewController
use App\Http\Controllers\ProductController; // THÊM DÒNG NÀY ĐỂ IMPORT PRODUCTCONTROLLER
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\PaymentGatewayController;
use App\Http\Controllers\Api\NewsApiController; // Import NewsApiController cho các API route tin tức
use App\Http\Controllers\Api\CategoryController; // ĐÃ THAY ĐỔI DÒNG NÀY ĐỂ IMPORT CATEGORYCONTROLLER TỪ THƯ MỤC API


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

// Route cho người dùng đã xác thực (thường dùng với Laravel Sanctum)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Các API Resource tự động tạo các route CRUD (GET, POST, PUT, DELETE)
// cho các tài nguyên tương ứng.
// Route Resource cho Product. Điều này sẽ tạo ra các route:
// GET /api/products (index)
// POST /api/products (store)
// GET /api/products/{id} (show)
// PUT/PATCH /api/products/{id} (update)
// DELETE /api/products/{id} (destroy)
Route::apiResource('products', ProductController::class);

// Gợi ý: Nếu bạn dùng Route::apiResource('products', ProductController::class);
// thì phương thức 'index' trong ProductController sẽ được gọi khi truy cập GET /api/products.
// Dòng dưới đây (Route::get('/products', [ProductController::class, 'indexApi']);)
// sẽ trở nên dư thừa hoặc gây xung đột nếu bạn muốn dùng 'indexApi' riêng biệt,
// hãy đảm bảo nó có đường dẫn khác hoặc bạn không dùng apiResource cho 'products'.
// Tôi sẽ comment nó lại. Nếu bạn thực sự cần một phương thức 'indexApi' riêng biệt,
// hãy đảm bảo nó có đường dẫn khác hoặc bạn không dùng apiResource cho 'products'.
// Route API cụ thể để ReactJS lấy danh sách sản phẩm
// Route::get('/products', [ProductController::class, 'indexApi']);


// Nhóm các route liên quan đến giỏ hàng
// Đã sửa tất cả các lần gọi Cart::class thành CartController::class
Route::prefix('cart')->group(function () {
    Route::post('add', [CartController::class, 'addToCart']);
    Route::get('view', [CartController::class, 'viewCart']);
    Route::put('update', [CartController::class, 'updateCartItem']);
    Route::delete('remove', [CartController::class, 'removeFromCart']);
    Route::post('clear', [CartController::class, 'clearCart']);
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

// THÊM ROUTE API CHO SẢN PHẨM TẠI ĐÂY
// Component ProductList trong React sẽ gọi API này để lấy dữ liệu sản phẩm.
// Đảm bảo ProductController của bạn có phương thức 'indexApi' (hoặc 'index' nếu nó trả về JSON).
Route::get('/products', [ProductController::class, 'indexApi']); // Hoặc ProductController::class, 'index' nếu phương thức index trả về JSON

Route::apiResource('vouchers', VoucherController::class);

Route::apiResource('payment_gateways', PaymentGatewayController::class);

// Các API route cho News (được thêm vào đây)
Route::get('/news', [NewsApiController::class, 'index']); // Lấy danh sách tin tức
Route::get('/news/{slug}', [NewsApiController::class, 'show']); // Lấy chi tiết tin tức theo slug
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/products', function () {
    return response()->json(['message' => 'API hoạt động']);
});
// Category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/detail/{id}', [ProductController::class, 'show']);
Route::post('/products/add', [ProductController::class, 'store']);
Route::put('/products/update/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ProductVariant routes
Route::get('/variants', [ProductVariantController::class, 'index']);
Route::get('/variants/{id}', [ProductVariantController::class, 'show']);
Route::post('/variants', [ProductVariantController::class, 'store']);
Route::put('/variants/{id}', [ProductVariantController::class, 'update']);
Route::delete('/variants/{id}', [ProductVariantController::class, 'destroy']);

// Định nghĩa các route cho AttributeController
// Giả sử bạn muốn lấy danh sách thuộc tính và tạo thuộc tính mới
Route::get('/attributes', [AttributeController::class, 'index']); // Lấy tất cả
Route::post('/attributes', [AttributeController::class, 'store']); // Tạo mới

// Bạn có thể thêm các route khác như show, update, destroy nếu cần
// Route::get('/attributes/{id}', [AttributeController::class, 'show']);
// Route::put('/attributes/{id}', [AttributeController::class, 'update']);
// Route::delete('/attributes/{id}', [AttributeController::class, 'destroy']);
