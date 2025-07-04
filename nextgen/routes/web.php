<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController; // Import HomeController cho trang chủ
use App\Http\Controllers\ProfileController; // Import cho các route mặc định của Breeze

// Import các Controller mới cho giao diện người dùng (frontend)
use App\Http\Controllers\ProductDetailController; // Controller cho trang chi tiết sản phẩm
use App\Http\Controllers\CartController;          // Controller cho trang giỏ hàng
use App\Http\Controllers\CheckoutController;      // Controller cho trang thanh toán

// Admin Controllers - Các Controller dành cho bảng điều khiển quản trị
use App\Http\Controllers\Admin\DashboardController; // Controller cho trang tổng quan Admin
use App\Http\Controllers\Admin\UserController;      // Controller quản lý người dùng Admin
use App\Http\Controllers\Admin\CategoryController;  // Controller quản lý danh mục Admin
use App\Http\Controllers\Admin\ProductController;   // Controller quản lý sản phẩm Admin (Giữ nguyên tên này cho Admin ProductController)
use App\Http\Controllers\Admin\OrderController;     // Controller quản lý đơn hàng Admin
use App\Http\Controllers\Admin\VoucherController;   // Controller quản lý voucher Admin
use App\Http\Controllers\Admin\NewsController;      // Import NewsController cho Admin

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

// Route cho trang chủ, sử dụng HomeController@index để hiển thị trang chính của website
Route::get('/', [HomeController::class, 'index']);

// Các route mặc định của Laravel Breeze cho Dashboard
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Nhóm các route liên quan đến Profile người dùng, yêu cầu xác thực
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Bao gồm các route xác thực (login, register, logout, password reset) từ file auth.php
require __DIR__.'/auth.php';

// --- Các Route mới cho giao diện người dùng (Chi tiết sản phẩm, Giỏ hàng, Thanh toán) ---

// Route cho trang chi tiết sản phẩm, hiển thị thông tin của một sản phẩm cụ thể dựa trên ID
Route::get('/products/{id}', [ProductDetailController::class, 'show'])->name('product.detail');

// Nhóm các route liên quan đến giỏ hàng, với prefix 'cart' và tên route 'cart.'
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index'); // Hiển thị trang giỏ hàng
    Route::post('/add', [CartController::class, 'add'])->name('add'); // Thêm sản phẩm vào giỏ hàng
    Route::put('/update', [CartController::class, 'update'])->name('update'); // Cập nhật số lượng sản phẩm trong giỏ hàng
    Route::delete('/remove/{cartId}', [CartController::class, 'remove'])->name('remove'); // Xóa sản phẩm khỏi giỏ hàng
});

// Nhóm các route liên quan đến thanh toán, yêu cầu người dùng đăng nhập
Route::prefix('checkout')->name('checkout.')->middleware('auth')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index'); // Hiển thị trang thanh toán
    Route::post('/place-order', [CheckoutController::class, 'placeOrder'])->name('placeOrder'); // Xử lý đặt hàng
    Route::get('/success/{orderId}', [CheckoutController::class, 'success'])->name('success'); // Trang thông báo đặt hàng thành công
});


// --- Route Group cho Admin Panel ---
// Các route trong nhóm này yêu cầu người dùng đã xác thực và có vai trò 'admin'
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard'); // Trang tổng quan Admin

    // Các route Resource cho quản lý Người dùng (CRUD)
    Route::resource('users', UserController::class);

    // Các route Resource cho quản lý Danh mục (CRUD)
    Route::resource('categories', CategoryController::class);

    // Các route Resource cho quản lý Sản phẩm (CRUD)
    Route::resource('products', ProductController::class);

    // Các route Resource cho quản lý Đơn hàng (CRUD)
    Route::resource('orders', OrderController::class);

    // Các route Resource cho quản lý Voucher (CRUD)
    Route::resource('vouchers', VoucherController::class);

    // Các route Resource cho quản lý Tin tức (CRUD)
    Route::resource('news', NewsController::class);
});

