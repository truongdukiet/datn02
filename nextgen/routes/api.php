<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\VariantAttributeController;
use App\Http\Controllers\AttributeController;

Route::apiResource('product_variants', ProductVariantController::class);
Route::apiResource('variant_attributes', VariantAttributeController::class);
Route::apiResource('attributes', AttributeController::class);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
