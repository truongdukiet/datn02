<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductVariant;
use App\Models\VariantAttribute;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = ProductVariant::with(['attributes.attribute']);
        
        // Lọc theo productId nếu có
        if ($request->has('product_id')) {
            $query->where('ProductID', $request->input('product_id'));
        }
        
        $variants = $query->get();
        return response()->json(['data' => $variants]);
    }

    // Thêm hàm mới
    public function getByProduct($productId)
    {
        $variants = ProductVariant::where('ProductID', $productId)->get();
        return response()->json(['data' => $variants]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Log toàn bộ dữ liệu request
        \Log::info('Create Variant Request Data:', [
            'all' => $request->all(),
            'attributes' => $request->input('attributes'),
            'files' => $request->file() ? array_keys($request->file()) : []
        ]);

        // Sửa validation để bao gồm attributes
        $validated = $request->validate([
            'ProductID' => 'required|exists:products,ProductID',
            'Sku' => 'required|unique:productvariants,Sku',
            'Price' => 'required|numeric|min:0',
            'Stock' => 'required|integer|min:0',
            'Image' => 'nullable|image|max:2048',
            'attributes' => 'required|array',
            'attributes.*' => 'required|string|max:255'
        ]);

        $variant = new ProductVariant();
        $variant->ProductID = $validated['ProductID'];
        $variant->Sku = $validated['Sku'];
        $variant->Price = $validated['Price'];
        $variant->Stock = $validated['Stock'];

        if ($request->hasFile('Image')) {
            $path = $request->file('Image')->store('product-variants', 'public');
            $variant->Image = $path;
        }

        $variant->save();

        // Xử lý attributes
        if ($request->has('attributes')) {
            foreach ($request->input('attributes') as $attrId => $value) {
                VariantAttribute::create([
                    'ProductVariantID' => $variant->ProductVariantID,
                    'AttributeID' => $attrId,
                    'value' => $value
                ]);
            }
        }

        return response()->json($variant, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $variant = ProductVariant::with(['product', 'attributes.attribute'])->find($id);

            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product variant not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $variant,
                'message' => 'Product variant retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product variant: ' . $e->getMessage()
            ], 500);
        }
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
        $variant = ProductVariant::findOrFail($id);

        // Kiểm tra content type để xử lý dữ liệu phù hợp
        if ($request->isJson()) {
            // Xử lý dữ liệu JSON
            $validated = $request->validate([
                'ProductID' => 'sometimes|exists:products,ProductID',
                'Sku' => 'required|unique:productvariants,Sku,' . $id . ',ProductVariantID',
                'Price' => 'required|numeric|min:0',
                'Stock' => 'required|integer|min:0',
                'attributes' => 'required|array',
                'attributes.*' => 'required|string|max:255'
            ]);

            $variant->fill($validated);
            $variant->save();

            // Xử lý attributes
            VariantAttribute::where('ProductVariantID', $variant->ProductVariantID)->delete();
            
            foreach ($validated['attributes'] as $attrId => $value) {
                VariantAttribute::create([
                    'ProductVariantID' => $variant->ProductVariantID,
                    'AttributeID' => $attrId,
                    'value' => $value
                ]);
            }

            return response()->json($variant);
        } else {
            // Xử lý form-data (cho trường hợp có upload ảnh)
            $validated = $request->validate([
                'Sku' => 'required|unique:productvariants,Sku,' . $id . ',ProductVariantID',
                'Price' => 'required|numeric|min:0',
                'Stock' => 'required|integer|min:0',
                'Image' => 'nullable|image|max:2048',
                'attributes' => 'required|array',
                'attributes.*' => 'required|string|max:255'
            ]);

            $variant->fill($validated);

            if ($request->hasFile('Image')) {
                if ($variant->Image) {
                    Storage::disk('public')->delete($variant->Image);
                }
                $path = $request->file('Image')->store('product-variants', 'public');
                $variant->Image = $path;
            }

            $variant->save();

            // Xử lý attributes
            VariantAttribute::where('ProductVariantID', $variant->ProductVariantID)->delete();
            
            foreach ($request->input('attributes') as $attrId => $value) {
                VariantAttribute::create([
                    'ProductVariantID' => $variant->ProductVariantID,
                    'AttributeID' => $attrId,
                    'value' => $value
                ]);
            }

            return response()->json($variant);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $variant = ProductVariant::find($id);

            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product variant not found'
                ], 404);
            }

            if ($variant->Image && Storage::disk('public')->exists($variant->Image)) {
                Storage::disk('public')->delete($variant->Image);
            }

            $variant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product variant deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting product variant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableImages()
    {
        try {
            $storagePath = 'storage/app/public/'; // Thư mục lưu trữ ảnh
            $files = Storage::disk('public')->allFiles($storagePath);
            
            $images = [];
            foreach ($files as $file) {
                // Chỉ lấy file ảnh (có thể mở rộng kiểm tra extension)
                if (preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
                    $images[] = [
                        'path' => $file,
                        'name' => basename($file),
                        'url' => Storage::disk('public')->url($file)
                    ];
                }
            }
            
            return response()->json([
                'success' => true,
                'data' => $images
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching images: ' . $e->getMessage()
            ], 500);
        }
    }
}