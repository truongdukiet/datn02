<?php
use App\Models\User; // Import Model User
use Illuminate\Auth\Events\Verified; // Import sự kiện Verified (liên quan đến xác minh email)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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

// Admin Controllers
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\VoucherController as AdminVoucherController;

/*
|--------------------------------------------------------------------------
|categories
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);



});

Route::apiResource(name: 'product-variants', controller: ProductVariantController::class); // Tuyến đường RES
// Product routes (API public) - Cần xem xét lại nếu bạn đã dùng apiResource cho products ở dưới
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/detail/{id}', [ProductController::class, 'show']);
Route::post('/products/add', [ProductController::class, 'store']);
Route::put('/products/update/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);




/*
|--------------------------------------------------------------------------
| ✅ USER ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/users/profile/{id}', [UserController::class, 'getProfile']); // Lấy thông tin profile user
Route::put('/users/{id}', [UserController::class, 'update']); // Cập nhật thông tin user

// ✅ Login & Register (đường dẫn đầy đủ)
Route::post('/users/register', [AuthController::class, 'register']);
Route::post('/users/login', [AuthController::class, 'login']);

// ✅ Login & Register (đường dẫn rút gọn /api/login và /api/register)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ✅ CRUD cho User
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| ✅ PRODUCT ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/products/search', [ProductController::class, 'search']);
Route::apiResource('products', ProductController::class);


/*
|--------------------------------------------------------------------------
| ✅ VARIANT ROUTES
|--------------------------------------------------------------------------
*/
Route::apiResource('variants', ProductVariantController::class);
Route::apiResource('attributes', AttributeController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-details', OrderDetailController::class);
Route::apiResource('vouchers', VoucherController::class);
Route::apiResource('payment-gateways', PaymentGatewayController::class);
Route::apiResource('reviews', ReviewController::class);
Route::apiResource('variant-attributes', VariantAttributeController::class);

/*
|--------------------------------------------------------------------------
| ✅ CART ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('carts')->group(function () {
    Route::get('/', [CartController::class, 'viewCart']);
    Route::post('/', [CartController::class, 'addToCart']);
    Route::put('/', [CartController::class, 'updateCartItem']);
    Route::delete('/item', [CartController::class, 'removeFromCart']);
    Route::delete('/', [CartController::class, 'clearCart']);
});

/*
|--------------------------------------------------------------------------
| ✅ FAVORITE PRODUCT ROUTES
|--------------------------------------------------------------------------
*/
// Product routes (API public) - Cần xem xét lại nếu bạn đã dùng apiResource cho products ở dưới
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/detail/{id}', [ProductController::class, 'show']);
Route::post('/products/add', [ProductController::class, 'store']);
Route::put('/products/update/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
// sản phẩm yêu thích
Route::prefix('favorite-products')->group(function () {
    Route::get('/{userId}', [FavoriteProductController::class, 'index']);
    Route::post('/', [FavoriteProductController::class, 'store']);
    Route::delete('/', [FavoriteProductController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| ✅ PASSWORD RESET ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::get('/reset-password', [PasswordResetController::class, 'redirectToWebForm']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
// News routes (nếu chỉ GET, giữ lại như sau)
Route::get('/news', [NewsApiController::class, 'index']);
Route::get('/news/{slug}', [NewsApiController::class, 'show']);
/*
|--------------------------------------------------------------------------
| ✅ VERIFY EMAIL ROUTE
|--------------------------------------------------------------------------
*/
Route::get('/verify-email/{userId}/{token}', [AuthController::class, 'verifyEmail']);

/*
|--------------------------------------------------------------------------
| ✅ ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Nhóm các tuyến đường dành cho khu vực quản trị (admin)
    Route::prefix('admin')->group(function () {
        // Các route API cho Admin Dashboard
        Route::get('/dashboard-stats', [AdminDashboardController::class, 'getStats']); // Lấy số liệu thống kê dashboard
        Route::get('/dashboard/recent-activities', [AdminDashboardController::class, 'getRecentActivities']); // Lấy dữ liệu hoạt động gần đây
        Route::get('/dashboard/category-stats', [AdminDashboardController::class, 'getCategoryStats']); // Lấy dữ liệu thống kê sản phẩm theo loại
    Route::apiResource('news', AdminNewsController::class);
        // Các route API cho Admin News (CRUD đầy đủ)

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
