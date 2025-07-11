<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; 
use App\Models\User;
use Illuminate\Auth\Events\Verified;

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
Route::get('/carts', [CartController::class, 'viewCart']);
Route::post('/carts', [CartController::class, 'addToCart']);
Route::put('/carts', [CartController::class, 'updateCartItem']);
Route::delete('/carts/item', [CartController::class, 'removeFromCart']);
Route::delete('/carts', [CartController::class, 'clearCart']);

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
Route::get('/verify-email/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['success' => false, 'message' => 'Invalid verification link.'], 400);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json([
            'success' => true,
            'message' => 'Email already verified.',
            'email_verified_at' => $user->email_verified_at,
        ]);
    }

    $user->markEmailAsVerified();
    event(new Verified($user));

    return response()->json([
        'success' => true,
        'message' => 'Email verified successfully.',
        'email_verified_at' => $user->email_verified_at,
    ]);
});

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
