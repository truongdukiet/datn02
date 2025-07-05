<?php
// app/Http/Controllers/Api/ProductController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // Kế thừa từ Base Controller của bạn
use Illuminate\Http\Request;
use App\Models\Product; // Giả sử bạn có một Model tên là Product

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Trả về tất cả sản phẩm dưới dạng JSON
        $products = Product::with(['category', 'variants.attributes.attribute', 'reviews'])->get();
        return response()->json(['success' => true, 'data' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validated = $request->validate([
            'CategoryID' => 'required|integer|exists:categories,CategoryID',
            'Name' => 'required|string|max:255',
            'Description' => 'nullable|string',
            'Image' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'Status' => 'nullable|boolean',
        ]);

        // Tạo sản phẩm mới
        $product = Product::create($validated);

        return response()->json(['success' => true, 'data' => $product], 201); // 201 Created
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with(['category', 'variants.attributes.attribute', 'reviews'])->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $product]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        // Validate dữ liệu đầu vào
        $validated = $request->validate([
            'CategoryID' => 'sometimes|integer|exists:categories,CategoryID',
            'Name' => 'sometimes|string|max:255',
            'Description' => 'nullable|string',
            'Image' => 'nullable|string',
            'base_price' => 'sometimes|numeric|min:0',
            'Status' => 'nullable|boolean',
        ]);

        // Cập nhật sản phẩm
        $product->update($validated);

        return response()->json(['success' => true, 'data' => $product]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['success' => true, 'message' => 'Product deleted']);
    }
}
