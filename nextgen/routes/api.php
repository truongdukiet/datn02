<?php

use Illuminate\Http\Request; // Import lớp Request để xử lý các yêu cầu HTTP
use Illuminate\Support\Facades\Route; // Import facade Route để định nghĩa các tuyến đường
use Illuminate\Support\Facades\Auth; // Import facade Auth để xử lý xác thực người dùng
use App\Models\User; // Import Model User
use Illuminate\Auth\Events\Verified; // Import sự kiện Verified (liên quan đến xác minh email)

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
use App\Http\Controllers\Api\ReviewController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\FavoriteProductController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\CartController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\VariantAttributeController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\NewsApiController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\AuthController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\PasswordResetController; // Đã sửa lỗi cú pháp
use App\Http\Controllers\Api\DashboardController; // Đã sửa lỗi cú pháp

// Import các Controller từ namespace Admin (để dùng cho chức năng export)
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController; // Import AdminCategoryController với alias
use App\Http\Controllers\Admin\NewsController as AdminNewsController; // Import AdminNewsController với alias để tránh nhầm lẫn
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController; // Import AdminDashboardController
use App\Http\Controllers\Admin\OrderController as AdminOrderController; // Import AdminOrderController
use App\Http\Controllers\Admin\ProductController as AdminProductController; // Import AdminProductController
use App\Http\Controllers\Admin\UserController as AdminUserController; // Import AdminUserController
use App\Http\Controllers\Admin\VoucherController as AdminVoucherController; // Import AdminVoucherController

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
Route::middleware('auth:sanctum')->get('/user', function (Request $request) { // Định nghĩa route được bảo vệ bởi middleware Sanctum
    return $request->user(); // Trả về thông tin người dùng hiện tại
});
// Category routes (API public)
Route::get('/categories', [CategoryController::class, 'index']); // Lấy tất cả danh mục
Route::get('/categories/{id}', [CategoryController::class, 'show']); // Lấy chi tiết danh mục theo ID
Route::post('/categories', [CategoryController::class, 'store']); // Tạo danh mục mới
Route::put('/categories/{id}', [CategoryController::class, 'update']); // Cập nhật danh mục theo ID
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // Xóa danh mục theo ID

// Product routes (API public)
Route::get('/products', [ProductController::class, 'index']); // Lấy tất cả sản phẩm
Route::get('/products/search', [ProductController::class, 'search']); // Tìm kiếm sản phẩm
Route::get('/products/detail/{id}', [ProductController::class, 'show']); // Lấy chi tiết sản phẩm theo ID
Route::post('/products/add', [ProductController::class, 'store']); // Thêm sản phẩm mới
Route::put('/products/update/{id}', [ProductController::class, 'update']); // Cập nhật sản phẩm theo ID
Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Xóa sản phẩm theo ID

// ProductVariant routes (API public)
Route::get('/variants', [ProductVariantController::class, 'index']); // Lấy tất cả biến thể sản phẩm
Route::get('/variants/{id}', [ProductVariantController::class, 'show']); // Lấy chi tiết biến thể sản phẩm theo ID
Route::post('/variants', [ProductVariantController::class, 'store']); // Tạo biến thể sản phẩm mới
Route::put('/variants/{id}', [ProductVariantController::class, 'update']); // Cập nhật biến thể sản phẩm theo ID
Route::delete('/variants/{id}', [ProductVariantController::class, 'destroy']); // Xóa biến thể sản phẩm theo ID


Route::get('/users', [UserController::class, 'index']); // Lấy tất cả người dùng
Route::get('/users/{id}', [UserController::class, 'show']); // Lấy chi tiết người dùng theo ID
Route::post('/users/register', [UserController::class, 'register']); // Đăng ký người dùng mới
Route::post('/users/login', [UserController::class, 'login']); // Đăng nhập người dùng
Route::put('/users/{id}', [UserController::class, 'update']); // Cập nhật thông tin người dùng theo ID
Route::delete('/users/{id}', [UserController::class, 'destroy']); // Xóa người dùng theo ID


// Product routes - chỉ dùng apiResource, không dùng prefix group
Route::get('products/search', [ProductController::class, 'search']); // Tuyến đường tìm kiếm sản phẩm
Route::apiResource('products', ProductController::class); // Tạo các tuyến đường RESTful cho sản phẩm

// Category, Variant, Attribute, Order, User, Voucher, PaymentGateway, Review, VariantAttribute (API Resource routes)
Route::apiResource('categories', CategoryController::class); // Tuyến đường RESTful cho danh mục
Route::apiResource('product-variants', ProductVariantController::class); // Tuyến đường RESTful cho biến thể sản phẩm
Route::apiResource('attributes', AttributeController::class); // Tuyến đường RESTful cho thuộc tính
Route::apiResource('orders', OrderController::class); // Tuyến đường RESTful cho đơn hàng
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
    Route::delete('/', [CartController::class, 'clearCart']); // Xóa toàn bộ giỏ hàng
});


// FavoriteProduct routes (custom, không dùng apiResource)
Route::prefix('favorite-products')->group(function () { // Nhóm các tuyến đường liên quan đến sản phẩm yêu thích
    Route::get('/{userId}', [FavoriteProductController::class, 'index']); // Lấy danh sách sản phẩm yêu thích của người dùng
    Route::post('/', [FavoriteProductController::class, 'store']); // Thêm sản phẩm vào danh sách yêu thích
    Route::delete('/', [FavoriteProductController::class, 'destroy']); // Xóa sản phẩm khỏi danh sách yêu thích
});

// News routes (nếu chỉ GET, giữ lại như sau)
Route::get('/news', [NewsApiController::class, 'index']); // Lấy tất cả tin tức
Route::get('/news/{slug}', [NewsApiController::class, 'show']); // Lấy chi tiết tin tức theo slug

// Nếu muốn CRUD đầy đủ cho news, dùng:
// Route::apiResource('news', NewsApiController::class); // Tuyến đường RESTful cho tin tức

Route::post('/register', [AuthController::class, 'register']); // Tuyến đường đăng ký (public)
Route::post('/login', [AuthController::class, 'login']); // Tuyến đường đăng nhập (public)

// Password reset routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']); // Gửi link reset mật khẩu
Route::get('/reset-password', [PasswordResetController::class, 'redirectToWebForm']); // Chuyển hướng đến form reset mật khẩu
Route::post('/reset-password', [PasswordResetController::class, 'reset']); // Reset mật khẩu

Route::get('/verify-email/{userId}/{token}', [App\Http\Controllers\Api\AuthController::class, 'verifyEmail']); // Xác minh email người dùng

// ========================================================================
// Thêm route cho DashboardController và NewsController (Admin API)
// ========================================================================
Route::middleware('auth:sanctum')->group(function () { // Nhóm các tuyến đường yêu cầu xác thực Sanctum
    // Sửa lỗi báo đỏ: Sử dụng AdminDashboardController cho route dashboard-stats
    Route::get('/dashboard-stats', [AdminDashboardController::class, 'index']); // Lấy số liệu thống kê dashboard

    // Các route API cho Admin
    Route::prefix('admin')->group(function () { // Nhóm các tuyến đường dành cho khu vực quản trị (admin)
        // Các route API cho Admin News (CRUD đầy đủ)
        // Các route này sẽ có dạng /api/admin/news, /api/admin/news/{news}, v.v.
        Route::apiResource('news', AdminNewsController::class); // Tuyến đường RESTful cho quản lý tin tức (admin)

        // THÊM ROUTE ĐỂ ĐẨY DANH MỤC LÊN GOOGLE SHEET TẠI ĐÂY
        // Route này sẽ có dạng /api/admin/categories/export-to-sheet
        Route::post('categories/export-to-sheet', [AdminCategoryController::class, 'exportCategoriesToSheet']); // Đẩy dữ liệu danh mục lên Google Sheet

        // THÊM ROUTE ĐỂ ĐẨY SỐ LIỆU DASHBOARD LÊN GOOGLE SHEET TẠI ĐÂY
        // Route này sẽ có dạng /api/admin/dashboard/export-to-sheet
        Route::post('dashboard/export-to-sheet', [AdminDashboardController::class, 'exportDashboardStatsToSheet']); // Đẩy số liệu dashboard lên Google Sheet

        // THÊM ROUTE ĐỂ ĐẨY DỮ LIỆU TIN TỨC LÊN GOOGLE SHEET TẠI ĐÂY
        // Route này sẽ có dạng /api/admin/news/export-to-sheet
        Route::post('news/export-to-sheet', [AdminNewsController::class, 'exportNewsToSheet']); // Đẩy dữ liệu tin tức lên Google Sheet

        // THÊM ROUTE ĐỂ ĐẨY DỮ LIỆU ĐƠN HÀNG LÊN GOOGLE SHEET TẠY ĐÂY
        // Route này sẽ có dạng /api/admin/orders/export-to-sheet
        Route::post('orders/export-to-sheet', [AdminOrderController::class, 'exportOrdersToSheet']); // Đẩy dữ liệu đơn hàng lên Google Sheet

        // THÊM ROUTE ĐỂ ĐẨY DỮ LIỆU SẢN PHẨM LÊN GOOGLE SHEET TẠI ĐÂY
        // Route này sẽ có dạng /api/admin/products/export-to-sheet
        Route::post('products/export-to-sheet', [AdminProductController::class, 'exportProductsToSheet']); // Đẩy dữ liệu sản phẩm lên Google Sheet

        // THÊM ROUTE ĐỂ ĐẨY DỮ LIỆU VOUCHER LÊN GOOGLE SHEET TẠY ĐÂY
        // Route này sẽ có dạng /api/admin/vouchers/export-to-sheet
        Route::post('vouchers/export-to-sheet', [AdminVoucherController::class, 'exportVouchersToSheet']); // Đẩy dữ liệu voucher lên Google Sheet

        // THÊM ROUTE ĐỂ ĐẨY DỮ LIỆU NGƯỜI DÙNG LÊN GOOGLE SHEET TẠI ĐÂY
        // Route này sẽ có dạng /api/admin/users/export-to-sheet
        Route::post('users/export-to-sheet', [AdminUserController::class, 'exportUsersToSheet']); // Đẩy dữ liệu người dùng lên Google Sheet
    });
});
