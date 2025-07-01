<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController; // Import HomeController cho trang chủ
use App\Http\Controllers\ProfileController; // Import cho các route mặc định của Breeze

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\VoucherController;


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

// Route cho trang chủ, sử dụng HomeController@index
Route::get('/', [HomeController::class, 'index']); // Đã cập nhật để sử dụng HomeController

// Các route mặc định của Laravel/Breeze (đã sửa lỗi cú pháp Route. thành Route::)
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update'); // Đã sửa lỗi cú pháp
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy'); // Đã sửa lỗi cú pháp
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
