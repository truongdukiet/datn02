<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('category', 'variants.attributes.attribute')->get());
    }

    public function show($id)
    {
        $product = Product::with('category', 'variants.attributes.attribute')->find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        return response()->json($product);
    }

    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'CategoryID' => 'nullable|integer|exists:categories,CategoryID',
            'Name' => 'required|string|max:255',
            'Description' => 'nullable|string',
            'Image' => 'nullable|url',
            'base_price' => 'required|numeric|min:0',
            'Status' => 'nullable|boolean',
            'Create_at' => 'nullable|date',
            'Update_at' => 'nullable|date',
        ]);

        if (!isset($validatedData['Status'])) {
            $validatedData['Status'] = 0;
        }

        $product = Product::create($validatedData);

        return response()->json([
            'message' => 'Thêm sản phẩm thành công!',
            'data' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm!'], 404);
        }

        $validatedData = $request->validate([
            'CategoryID' => 'nullable|integer|exists:categories,CategoryID',
            'Name' => 'required|string|max:255',
            'Description' => 'nullable|string',
            'Image' => 'nullable|url',
            'base_price' => 'required|numeric|min:0',
            'Status' => 'nullable|boolean',
            'Create_at' => 'nullable|date',
            'Update_at' => 'nullable|date',
        ]);

        $product->update($validatedData);

        return response()->json([
            'message' => 'Cập nhật sản phẩm thành công!',
            'data' => $product
        ]);
    }

    /**
     * Search products by name or description
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
{
    try {
        $query = $request->get('q');
        $categoryId = $request->get('category_id');
        $minPrice = $request->get('min_price');
        $maxPrice = $request->get('max_price');

        $products = Product::with(['category', 'variants.attributes.attribute'])
           ->when($query, function ($q) use ($query) {
    return $q->where(function ($sub) use ($query) {
        // Ưu tiên tìm trong Name trước
        $sub->where('Name', 'like', "%{$query}%");

        // Nếu muốn tìm thêm trong Description thì cho tùy chọn
        // nhưng chỉ lấy nếu Name không khớp
        $sub->orWhere(function ($desc) use ($query) {
            $desc->where('Description', 'like', "%{$query}%")
                 ->whereRaw('Name NOT LIKE ?', ["%{$query}%"]);
        });
    });
})

            ->when($categoryId, function ($q) use ($categoryId) {
                return $q->where('CategoryID', $categoryId);
            })
            ->when($minPrice, function ($q) use ($minPrice) {
                return $q->where('base_price', '>=', $minPrice);
            })
            ->when($maxPrice, function ($q) use ($maxPrice) {
                return $q->where('base_price', '<=', $maxPrice);
            })
            ->orderBy('Create_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'message' => 'Products searched successfully'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error searching products: ' . $e->getMessage()
        ], 500);
    }
}

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product)
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);

        $product->delete();

        return response()->json(['message' => 'Sản phẩm đã được xóa (ẩn mềm).']);
    }

    public function restore($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product)
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);

        $product->restore();

        return response()->json(['message' => 'Sản phẩm đã được phục hồi!']);

        // Lấy tất cả sản phẩm, kèm biến thể và category (nếu muốn)
        $products = \App\Models\Product::with(['category', 'variants.variantAttributes'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}
