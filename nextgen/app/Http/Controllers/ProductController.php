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

    public function search(Request $request)
    {
        $query = Product::with('category', 'variants.attributes.attribute');

        if ($request->filled('query')) {
            $query->where('Name', 'like', '%' . $request->query('query') . '%');
        }

        if ($request->filled('categoryID') && is_numeric($request->categoryID)) {
            $query->where('CategoryID', $request->categoryID);
        }

        if ($request->filled('priceRange')) {
            $range = explode(',', $request->priceRange);
            if (count($range) === 2 && is_numeric($range[0]) && is_numeric($range[1])) {
                $query->whereBetween('base_price', [$range[0], $range[1]]);
            }
        }

        if ($request->has('status') && in_array($request->status, ['0', '1'])) {
            $query->where('Status', $request->status);
        }

        return response()->json($query->get());
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
