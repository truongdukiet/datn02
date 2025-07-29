<?php
// app/Http/Controllers/Api/ProductController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\VariantAttribute;
use App\Models\Attribute;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $products = Product::with(['category', 'variants.attributes.attribute', 'reviews'])
                ->orderBy('Create_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true, 
                'data' => $products,
                'message' => 'Products retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving products: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Validate input data
            $validator = Validator::make($request->all(), [
                'CategoryID' => 'required|integer|exists:categories,CategoryID',
                'Name' => 'required|string|max:255',
                'Description' => 'nullable|string',
                'base_price' => 'required|numeric|min:0',
                'Status' => 'nullable|boolean',
                'Stock' => 'nullable|integer|min:0',
                'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image file
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create new product data
            $productData = $validator->validated();
            $productData['Create_at'] = now();
            $productData['Update_at'] = now();

            // Handle image upload if present
            if ($request->hasFile('image_file')) {
                $imagePath = $request->file('image_file')->store('products', 'public');
                $productData['Image'] = $imagePath; // Save the image path
            } else {
                $productData['Image'] = null; // Ensure Image key exists
            }

            $product = Product::create($productData);

            // Load product with relationships
            $product->load(['category', 'variants.attributes.attribute']);

            return response()->json([
                'success' => true, 
                'data' => $product,
                'message' => 'Product created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating product: ' . $e->getMessage()
            ], 500);
        }
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
            $product = Product::with(['category', 'variants.attributes.attribute', 'reviews'])
                ->find($id);

            if (!$product) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Product not found'
                ], 404);
            }

            return response()->json([
                'success' => true, 
                'data' => $product,
                'message' => 'Product retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product: ' . $e->getMessage()
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
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Product not found'
                ], 404);
            }

            // Validate dữ liệu đầu vào
            $validator = Validator::make($request->all(), [
                'CategoryID' => 'sometimes|integer|exists:categories,CategoryID',
                'Name' => 'sometimes|string|max:255',
                'Description' => 'nullable|string',
                'Image' => 'nullable|string|max:500',
                'base_price' => 'sometimes|numeric|min:0',
                'Status' => 'nullable|boolean',
                'variants' => 'nullable|array',
                'variants.*.ProductID' => 'nullable|integer|exists:product_variants,ProductVariantID',
                'variants.*.Price' => 'required_with:variants|numeric|min:0',
                'variants.*.Stock' => 'required_with:variants|integer|min:0',
                'variants.*.attributes' => 'nullable|array',
                'variants.*.attributes.*.attribute_id' => 'required_with:variants.*.attributes|integer|exists:attributes,AttributeID',
                'variants.*.attributes.*.value' => 'required_with:variants.*.attributes|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Cập nhật sản phẩm
            $productData = $validator->validated();
            $productData['Update_at'] = now();

            // Xử lý upload ảnh mới nếu có
            if ($request->hasFile('image_file')) {
                // Xóa ảnh cũ nếu có
                if ($product->Image && Storage::disk('public')->exists($product->Image)) {
                    Storage::disk('public')->delete($product->Image);
                }
                
                $imagePath = $request->file('image_file')->store('products', 'public');
                $productData['Image'] = $imagePath;
            }

            $product->update($productData);

            // Xử lý variants nếu có
            if ($request->has('variants') && is_array($request->variants)) {
                // Xóa tất cả variants cũ
                $product->variants()->delete();
                
                // Tạo variants mới
                foreach ($request->variants as $variantData) {
                    $variant = $product->variants()->create([
                        'ProductID' => $product->ProductID,
                        'Sku' => $variantData['Sku'] ?? uniqid('SKU-'),
                        'Price' => $variantData['Price'],
                        'Stock' => $variantData['Stock'] ?? 0,
                        'Create_at' => now(),
                        'Update_at' => now()
                    ]);

                    // Xử lý attributes cho variant
                    if (isset($variantData['attributes']) && is_array($variantData['attributes'])) {
                        foreach ($variantData['attributes'] as $attrData) {
                            $variant->attributes()->create([
                                'ProductVariantID' => $variant->ProductVariantID,
                                'AttributeID' => $attrData['attribute_id'],
                                'value' => $attrData['value']
                            ]);
                        }
                    }
                }
            }

            // Load lại product với relationships
            $product->load(['category', 'variants.attributes.attribute']);

            return response()->json([
                'success' => true, 
                'data' => $product,
                'message' => 'Product updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating product: ' . $e->getMessage()
            ], 500);
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
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Product not found'
                ], 404);
            }

            // Xóa ảnh nếu có
            if ($product->Image && Storage::disk('public')->exists($product->Image)) {
                Storage::disk('public')->delete($product->Image);
            }

            // Xóa product (cascade sẽ xóa variants và attributes)
            $product->delete();

            return response()->json([
                'success' => true, 
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting product: ' . $e->getMessage()
            ], 500);
        }
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
                    return $q->where('Name', 'like', "%{$query}%")
                            ->orWhere('Description', 'like', "%{$query}%");
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
}
