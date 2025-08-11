<?php

use Illuminate\Http\Request; // Import lớp Request để xử lý các yêu cầu HTTP
use Illuminate\Support\Facades\Route; // Import facade Route để định nghĩa các tuyến đường
use Illuminate\Support\Facades\Auth; // Import facade Auth để xử lý xác thực người dùng
use App\Models\User; // Import Model User
use Illuminate\Auth\Events\Verified; // Import sự kiện Verified (liên quan đến xác minh email)
use App\Models\Order; // Import Model Order
use App\Models\Product; // Import Model Product
use App\Models\Category; // Import Model Category
// Import tất cả các Controller API từ namespace App\Http\Controllers\Api
use App\Http\Controllers\Api\CategoryController; // Import CategoryController
use App\Http\Controllers\Api\ProductController; // Import ProductController
use App\Http\Controllers\Api\ProductVariantController; // Import ProductVariantController
use App\Http\Controllers\Api\AttributeController; // Import AttributeController
use App\Http\Controllers\Api\OrderController; // Import OrderController
use App\Http\Controllers\Api\OrderDetailController; // Import OrderDetailController
use App\Http\Controllers\Api\UserController; // Import UserController
use App\Http\Controllers\Api\VoucherController; // Import VoucherController
use App\Http\Controllers\Api\PaymentGatewayController; // Import PaymentGatewayController
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\VariantAttributeController;
use App\Http\Controllers\Api\NewsApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
// use App\Http\Controllers\Api\DashboardController; // Đây là DashboardController public nếu có
use App\Http\Controllers\Api\CheckoutController;
// Import các Controller từ namespace Admin (để dùng cho chức năng export và admin CRUD)
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController; // Import AdminCategoryController với alias
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController; // Import AdminDashboardController
use App\Http\Controllers\Api\DashboardController; // Import ApiDashboardController
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

Route::middleware('auth:sanctum')->group(function () {

});

    // Lấy đơn hàng theo user ID
    Route::get('orders/user/{userId}', [OrderController::class, 'getUserOrders']);
    
    // Hủy đơn hàng
    Route::put('orders/{orderId}/cancel', [OrderController::class, 'cancelOrder']);
// routes/api.php
Route::get('orders/{orderId}', [OrderController::class, 'getOrderDetail']);
Route::get('/test-dashboard', function() {
    try {
        // Test từng thành phần
        $tests = [
            'users_count' => User::count(),
            'products_count' => Product::count(),
            'orders_count' => Order::count(),
            'revenue' => Order::where('status', 'completed')->sum('total_amount'),
            'recent_order' => Order::latest()->first()
        ];
        
        return response()->json([
            'success' => true,
            'tests' => $tests
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
Route::prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('stats', [DashboardController::class, 'getStats']);
    Route::get('user-growth', [DashboardController::class, 'getUserGrowth']);
    Route::get('revenue', [DashboardController::class, 'getRevenue']);
    Route::get('recent-orders', [DashboardController::class, 'getRecentOrders']);
    Route::get('order-status', [DashboardController::class, 'getOrderStatus']);
});
// routes/api.php
  Route::post('/payment', [CheckoutController::class, 'payment']);

Route::get('/payment/return', [CheckoutController::class, 'payment_return'])->name('payment.return');

Route::apiResource('news', NewsApiController::class); // Tuyến đường RESTful cho quản lý tin tức (admin)
Route::put('news/{id}', [NewsApiController::class, 'update']);
Route::apiResource('categories', CategoryController::class);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

Route::apiResource(name: 'product-variants', controller: ProductVariantController::class); // Tuyến đường RESTful cho biến thể sản phẩm


// Product routes (API public) - Cần xem xét lại nếu bạn đã dùng apiResource cho products ở dưới
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/detail/{id}', [ProductController::class, 'show']);
Route::post('/products/add', [ProductController::class, 'store']);
Route::put('/products/update/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ProductVariant routes (API public)


// User routes (API public) - Cần xem xét lại nếu bạn đã dùng apiResource cho users ở dưới
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users/register', [UserController::class, 'register']);
Route::post('/users/login', [UserController::class, 'login']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Product routes - chỉ dùng apiResource, không dùng prefix group
Route::get('products/search', [ProductController::class, 'search']); // Tuyến đường tìm kiếm sản phẩm
Route::apiResource('products', ProductController::class); // Tạo các tuyến đường RESTful cho sản phẩm

// Category, Variant, Attribute, Order, User, Voucher, PaymentGateway, Review, VariantAttribute (API Resource routes)
Route::apiResource('attributes', AttributeController::class); // Tuyến đường RESTful cho thuộc tính
Route::apiResource('orders', OrderController::class); // Tuyến đường RESTful cho đơn hàng
Route::post('orders/{userId}', [OrderController::class, 'store']); // Đặt hàng cho người dùng
Route::apiResource('order-details', OrderDetailController::class); // Tuyến đường RESTful cho chi tiết đơn hàng
Route::apiResource('users', UserController::class); // Tuyến đường RESTful cho người dùng
Route::apiResource('vouchers', VoucherController::class); // Tuyến đường RESTful cho voucher
Route::apiResource('payment-gateways', PaymentGatewayController::class); // Tuyến đường RESTful cho cổng thanh toán
Route::apiResource('reviews', ReviewController::class); // Tuyến đường RESTful cho đánh giá
Route::apiResource('variant-attributes', VariantAttributeController::class); // Tuyến đường RESTful cho thuộc tính biến thể

// Cart routes (custom, không dùng apiResource)
Route::middleware('auth:sanctum')->prefix('carts')->group(function () { // Nhóm các tuyến đường liên quan đến giỏ hàng
    Route::get('/', [CartController::class, 'viewCart']); // Xem giỏ hàng
    Route::post('/', [CartController::class, 'addToCart']); // Thêm sản phẩm vào giỏ hàng
    Route::put('/', [CartController::class, 'updateCartItem']); // Cập nhật số lượng sản phẩm trong giỏ hàng
    Route::delete('/item', [CartController::class, 'removeFromCart']); // Xóa một sản phẩm khỏi giỏ hàng
    Route::delete('/clear', [CartController::class, 'clearCart']); // Xóa toàn bộ giỏ hàng

});


// FavoriteProduct routes (custom, không dùng apiResource)
Route::prefix('favorite-products')->group(function () {
    Route::get('/{userId}', [FavoriteProductController::class, 'index']);
    Route::post('/', [FavoriteProductController::class, 'store']);
    Route::delete('/', [FavoriteProductController::class, 'destroy']);
});



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::get('/reset-password', [PasswordResetController::class, 'redirectToWebForm']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::get('/verify-email/{userId}/{token}', [App\Http\Controllers\Api\AuthController::class, 'verifyEmail']);

// ========================================================================
// Các route API cho Admin (yêu cầu xác thực Sanctum)
// ========================================================================
Route::middleware('auth:sanctum')->group(function () {
    // Nhóm các tuyến đường dành cho khu vực quản trị (admin)
    Route::prefix('admin')->group(function () {
        // Các route API cho Admin Dashboard
        Route::get('/dashboard-stats', [AdminDashboardController::class, 'getStats']); // Lấy số liệu thống kê dashboard
        Route::get('/dashboard/recent-activities', [AdminDashboardController::class, 'getRecentActivities']); // Lấy dữ liệu hoạt động gần đây
        Route::get('/dashboard/category-stats', [AdminDashboardController::class, 'getCategoryStats']); // Lấy dữ liệu thống kê sản phẩm theo loại


        // THÊM CÁC ROUTE QUẢN LÝ DANH MỤC ADMIN TẠI ĐÂY
        // Các route này sẽ có dạng /api/admin/categories, /api/admin/categories/{id}, v.v.
        Route::get('/categories', [AdminCategoryController::class, 'index']); // Lấy tất cả danh mục admin
        Route::post('/categories', [AdminCategoryController::class, 'store']); // Tạo danh mục admin mới
        Route::get('/categories/{id}', [AdminCategoryController::class, 'show']); // Lấy chi tiết danh mục admin theo ID
        Route::put('/categories/{id}', [AdminCategoryController::class, 'update']); // Cập nhật danh mục admin theo ID
        Route::patch('/categories/{id}', [AdminCategoryController::class, 'update']); // Cập nhật danh mục admin theo ID
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']); // Xóa danh mục admin theo ID
    });
});
