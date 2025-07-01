<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\VariantAttributeController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\Cart; // Đảm bảo import đúng Controller của giỏ hàng
use App\Http\Controllers\FavoriteProductController; // Thêm dòng này để import FavoriteProductController
use App\Http\Controllers\ReviewController; // Thêm dòng này để import ReviewController

use App\Http\Controllers\ProfileController; // Import cho các route mặc định của Breeze
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController; // Đảm bảo dòng này đã có
use App\Http\Controllers\Admin\CategoryController; // Đảm bảo dòng này đã có
use App\Http\Controllers\Admin\ProductController; // Thêm dòng này
use App\Http\Controllers\Admin\OrderController; // Thêm dòng này
use App\Http\Controllers\Admin\VoucherController; // Thêm dòng này


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
// GET     /api/reviews             -> index (Lấy tất cả hoặc lọc)
// POST    /api/reviews             -> store (Thêm mới)
// GET     /api/reviews/{review}    -> show (Lấy chi tiết 1 review)
// PUT/PATCH /api/reviews/{review} -> update (Cập nhật)
// DELETE /api/reviews/{review}    -> destroy (Xóa)
Route::apiResource('reviews', ReviewController::class);


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Các route mặc định của Laravel/Breeze
Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// --- Route Group cho Admin Panel ---
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Các route cho quản lý Người dùng
    Route::resource('users', UserController::class);

    // Các route cho quản lý Danh mục
    Route::resource('categories', CategoryController::class);

    // Các route cho quản lý Sản phẩm
    Route::resource('products', ProductController::class);

    // Các route cho quản lý Đơn hàng
    Route::resource('orders', OrderController::class);

    // Các route cho quản lý Voucher
    Route::resource('vouchers', VoucherController::class);
});
