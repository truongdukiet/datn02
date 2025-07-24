<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

// Import tất cả các Controller API từ namespace App\Http\Controllers\Api
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductVariantController;
use App\Http\Controllers\Api\AttributeController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderDetailController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\PaymentGatewayController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\VariantAttributeController;
use App\Http\Controllers\Api\NewsApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\DashboardController;

// Import CategoryController từ namespace Admin (để dùng cho chức năng export)
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController; // Đặt alias để tránh trùng tên với Api\CategoryController
use App\Http\Controllers\Admin\NewsController; // Import NewsController từ namespace Admin

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
// Category routes (API public)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Product routes (API public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/detail/{id}', [ProductController::class, 'show']);
Route::post('/products/add', [ProductController::class, 'store']);
Route::put('/products/update/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ProductVariant routes (API public)
Route::get('/variants', [ProductVariantController::class, 'index']);
Route::get('/variants/{id}', [ProductVariantController::class, 'show']);
Route::post('/variants', [ProductVariantController::class, 'store']);
Route::put('/variants/{id}', [ProductVariantController::class, 'update']);
Route::delete('/variants/{id}', [ProductVariantController::class, 'destroy']);


Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users/register', [UserController::class, 'register']);
Route::post('/users/login', [UserController::class, 'login']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


// Product routes - chỉ dùng apiResource, không dùng prefix group
Route::get('products/search', [ProductController::class, 'search']);
Route::apiResource('products', ProductController::class);

// Category, Variant, Attribute, Order, User, Voucher, PaymentGateway, Review, VariantAttribute
Route::apiResource('categories', CategoryController::class);
Route::apiResource('product-variants', ProductVariantController::class);
Route::apiResource('attributes', AttributeController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-details', OrderDetailController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('vouchers', VoucherController::class);
Route::apiResource('payment-gateways', PaymentGatewayController::class);
Route::apiResource('reviews', ReviewController::class);
Route::apiResource('variant-attributes', VariantAttributeController::class);

// Cart routes (custom, không dùng apiResource)
Route::prefix('carts')->group(function () {
    Route::get('/', [CartController::class, 'viewCart']);
    Route::post('/', [CartController::class, 'addToCart']);
    Route::put('/', [CartController::class, 'updateCartItem']);
    Route::delete('/item', [CartController::class, 'removeFromCart']);
    Route::delete('/', [CartController::class, 'clearCart']);
});


// FavoriteProduct routes (custom, không dùng apiResource)
Route::prefix('favorite-products')->group(function () {
    Route::get('/{userId}', [FavoriteProductController::class, 'index']);
    Route::post('/', [FavoriteProductController::class, 'store']);
    Route::delete('/', [FavoriteProductController::class, 'destroy']);
});

// News routes (nếu chỉ GET, giữ lại như sau)
Route::get('/news', [NewsApiController::class, 'index']);
Route::get('/news/{slug}', [NewsApiController::class, 'show']);

// Nếu muốn CRUD đầy đủ cho news, dùng:
// Route::apiResource('news', NewsApiController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::get('/reset-password', [PasswordResetController::class, 'redirectToWebForm']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::get('/verify-email/{userId}/{token}', [App\Http\Controllers\Api\AuthController::class, 'verifyEmail']);

// ========================================================================
// Thêm route cho DashboardController và NewsController (Admin API)
// ========================================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);

    // Các route API cho Admin
    Route::prefix('admin')->group(function () {
        // Các route API cho Admin News (CRUD đầy đủ)
        // Các route này sẽ có dạng /api/admin/news, /api/admin/news/{news}, v.v.
        Route::apiResource('news', NewsController::class);

        // THÊM ROUTE ĐỂ ĐẨY DANH MỤC LÊN GOOGLE SHEET TẠI ĐÂY
        // Route này sẽ có dạng /api/admin/categories/export-to-sheet
        Route::post('categories/export-to-sheet', [AdminCategoryController::class, 'exportToSheet']);
    });
});
