<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductDetailController extends Controller
{
    /**
     * Hiển thị trang chi tiết sản phẩm.
     *
     * @param  int  $productId
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($productId)
    {
        // Lấy sản phẩm bao gồm các biến thể và thuộc tính của biến thể
        $product = Product::with(['variants.attributes.attribute'])->find($productId);

        if (!$product) {
            abort(404); // Hoặc chuyển hướng đến trang lỗi 404
        }

        // Lấy các reviews liên quan nếu có
        // $product->load(['variants.reviews.user']); // Cần thêm mối quan hệ reviews trong ProductVariant và user trong Review

        return view('product.detail', compact('product'));
    }
}
