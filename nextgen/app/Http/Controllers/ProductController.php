<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        // Lấy tất cả sản phẩm, kèm biến thể và category (nếu muốn)
        $products = \App\Models\Product::with(['category', 'variants.variantAttributes'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}
