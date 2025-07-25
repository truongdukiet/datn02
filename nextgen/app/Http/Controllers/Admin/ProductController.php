<?php

namespace App\Http\Controllers\Api; // Namespace phù hợp với các Controller API khác

use App\Http\Controllers\Controller;
use App\Models\Product; // Import Model Product
use App\Models\Category; // Có thể cần để xác thực CategoryID
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Để xác thực duy nhất
use Illuminate\Validation\ValidationException; // Để bắt lỗi xác thực
use Illuminate\Support\Facades\Storage; // Để quản lý file ảnh

// Import các lớp Google API
use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;
// use Google\Service\Sheets\ClearValuesRequest; // Không cần import nếu không dùng clear()

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách tất cả các sản phẩm dưới dạng JSON.
     *
     * GET /api/products
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Lấy tất cả sản phẩm, có thể thêm phân trang, tìm kiếm, lọc
            $perPage = $request->query('per_page', 10);
            $products = Product::paginate($perPage);

            // Trả về dữ liệu sản phẩm dưới dạng JSON
            return response()->json($products, 200);
        } catch (\Exception $e) {
            // Xử lý các lỗi không mong muốn
            return response()->json(['message' => 'Error fetching products.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Lưu một sản phẩm mới vào database và trả về JSON.
     *
     * POST /api/products
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // 1. Xác thực dữ liệu đầu vào từ request
            $validatedData = $request->validate([
                'name' => 'required|string|max:255|unique:products,name',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock_quantity' => 'required|integer|min:0',
                'category_id' => 'required|exists:categories,CategoryID', // Đảm bảo category_id tồn tại trong bảng categories
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Ảnh là tùy chọn, tối đa 2MB
            ]);

            // 2. Xử lý upload ảnh nếu có
            $imagePath = null;
            if ($request->hasFile('image')) {
                // Lưu ảnh vào 'storage/app/public/product_images'
                $imagePath = $request->file('image')->store('product_images', 'public');
            }

            // 3. Tạo sản phẩm mới trong database
            $product = Product::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'price' => $validatedData['price'],
                'stock_quantity' => $validatedData['stock_quantity'],
                'category_id' => $validatedData['category_id'],
                'image' => $imagePath,
                // Laravel tự động quản lý `created_at` và `updated_at`
            ]);

            // 4. Trả về sản phẩm vừa tạo với mã trạng thái 201 Created
            return response()->json([
                'message' => 'Product created successfully.',
                'product' => $product
            ], 201);

        } catch (ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json(['errors' => $e->errors()], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            // Xử lý các lỗi không mong muốn khác (ví dụ: lỗi database, lỗi lưu trữ file)
            return response()->json(['message' => 'Error creating product.', 'error' => $e->getMessage()], 500); // 500 Internal Server Error
        }
    }

    /**
     * Display the specified resource.
     * Hiển thị chi tiết một sản phẩm cụ thể dưới dạng JSON.
     *
     * GET /api/products/{product}
     *
     * @param  \App\Models\Product  $product (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Product $product)
    {
        // Laravel sẽ tự động tìm sản phẩm dựa trên ID/slug từ URL (Route Model Binding).
        // Nếu không tìm thấy, Laravel sẽ tự động trả về 404 Not Found.
        return response()->json($product, 200); // Trả về sản phẩm dưới dạng JSON
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật một sản phẩm cụ thể trong database và trả về JSON.
     *
     * PUT/PATCH /api/products/{product}
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Product $product)
    {
        try {
            // 1. Xác thực dữ liệu đầu vào từ request
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255', Rule::unique('products', 'name')->ignore($product->id)], // Tên duy nhất, bỏ qua sản phẩm hiện tại
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock_quantity' => 'required|integer|min:0',
                'category_id' => 'required|exists:categories,CategoryID',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'clear_image' => 'nullable|boolean', // Trường mới để xóa ảnh hiện có
            ]);

            // 2. Xử lý ảnh mới hoặc xóa ảnh cũ
            $imagePath = $product->image; // Giữ đường dẫn ảnh cũ mặc định
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ nếu tồn tại
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }
                $imagePath = $request->file('image')->store('product_images', 'public');
            } elseif (isset($validatedData['clear_image']) && $validatedData['clear_image']) {
                // Nếu 'clear_image' là true, xóa ảnh hiện có
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }
                $imagePath = null;
            }

            // 3. Cập nhật sản phẩm trong database
            $product->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'price' => $validatedData['price'],
                'stock_quantity' => $validatedData['stock_quantity'],
                'category_id' => $validatedData['category_id'],
                'image' => $imagePath,
                // Laravel tự động quản lý `updated_at`
            ]);

            // 4. Trả về sản phẩm đã cập nhật dưới dạng JSON
            return response()->json([
                'message' => 'Product updated successfully.',
                'product' => $product
            ], 200);

        } catch (ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Xử lý các lỗi không mong muốn khác
            return response()->json(['message' => 'Error updating product.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Xóa một sản phẩm cụ thể khỏi database và trả về JSON.
     *
     * DELETE /api/products/{product}
     *
     * @param  \App\Models\Product  $product (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Product $product)
    {
        try {
            // 1. Xóa ảnh liên quan nếu tồn tại
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            // 2. Xóa sản phẩm khỏi database
            $product->delete();

            // 3. Trả về thông báo thành công dưới dạng JSON
            return response()->json(['message' => 'Product deleted successfully.'], 200);
            // Hoặc: return response()->noContent(); // 204 No Content
        } catch (\Exception $e) {
            // Xử lý lỗi trong quá trình xóa (ví dụ: lỗi khóa ngoại)
            return response()->json(['message' => 'Error deleting product.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Search for products.
     * Tìm kiếm sản phẩm dựa trên tên hoặc mô tả.
     *
     * GET /api/products/search?query=keyword
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        try {
            $query = $request->query('query');
            if (!$query) {
                return response()->json(['message' => 'Vui lòng cung cấp từ khóa tìm kiếm.'], 400);
            }

            $products = Product::where('name', 'LIKE', '%' . $query . '%')
                               ->orWhere('description', 'LIKE', '%' . $query . '%')
                               ->get();

            return response()->json($products, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error during product search.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Export products data to Google Sheet.
     * Đẩy dữ liệu sản phẩm hiện có lên Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportProductsToSheet(Request $request)
    {
        try {
            // 1. Khởi tạo Google Client với thông tin xác thực Service Account
            $client = new Client();
            $client->setAuthConfig(base_path(env('GOOGLE_SHEET_SERVICE_ACCOUNT_PATH')));
            $client->addScope(Sheets::SPREADSHEETS);
            $client->addScope(Sheets::DRIVE); // Cần nếu bạn muốn quản lý file trên Drive

            $service = new Sheets($client);

            // Lấy ID của Google Sheet dành cho sản phẩm từ .env
            $spreadsheetId = env('GOOGLE_PRODUCT_SHEET_ID');
            $sheetName = 'Products Data'; // Tên của sheet trong Google Sheet mà bạn muốn ghi vào
            $range = $sheetName . '!A:Z'; // Phạm vi ghi dữ liệu

            // 2. Lấy tất cả sản phẩm từ database và eager load category
            $products = Product::with('category')
                                ->orderBy('created_at', 'asc')
                                ->get();

            // 3. Chuẩn bị dữ liệu để đẩy lên Google Sheet
            $values = [];
            // LƯU Ý: Dòng thêm hàng tiêu đề đã được BỎ ĐI để tránh lặp lại.
            // Điều này giả định Google Sheet của bạn đã có sẵn hàng tiêu đề.
            /*
            $values[] = [
                'Product ID', 'Name', 'Description', 'Price', 'Stock Quantity',
                'Category ID', 'Category Name', 'Image Path', 'Created At', 'Updated At'
            ];
            */

            // Duyệt qua từng sản phẩm và thêm vào mảng $values
            foreach ($products as $product) {
                $values[] = [
                    $product->id,
                    $product->name,
                    $product->description,
                    $product->price,
                    $product->stock_quantity,
                    $product->category_id,
                    $product->category->Name ?? 'N/A', // Lấy tên danh mục nếu có eager load và quan hệ đúng
                    $product->image,
                    $product->created_at ? $product->created_at->format('Y-m-d H:i:s') : '',
                    $product->updated_at ? $product->updated_at->format('Y-m-d H:i:s') : ''
                ];
            }

            // Nếu không có dữ liệu nào để đẩy, có thể trả về thông báo
            if (empty($values)) {
                return response()->json([
                    'status' => 'info',
                    'message' => 'Không có dữ liệu sản phẩm nào để đẩy lên Google Sheet.'
                ], 200);
            }

            $body = new ValueRange([
                'values' => $values
            ]);

            $params = [
                'valueInputOption' => 'RAW' // Ghi dữ liệu nguyên bản
            ];

            // ĐOẠN CODE XÓA DỮ LIỆU CŨ ĐÃ ĐƯỢC BỎ ĐI HOẶC COMMENT ĐỂ ĐẢM BẢO DỮ LIỆU ĐƯỢC APPEND
            // $clearBody = new ClearValuesRequest();
            // $service->spreadsheets_values->clear($spreadsheetId, $sheetName, $clearBody);

            // 5. Ghi dữ liệu vào Google Sheet
            // append() sẽ thêm dữ liệu vào hàng trống đầu tiên sau dữ liệu hiện có.
            $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);

            // 6. Trả về phản hồi JSON cho ReactJS
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu sản phẩm đã được đẩy thành công vào Google Sheet!',
                'updates' => $result->getUpdates()
            ]);

        } catch (\Exception $e) {
            // Xử lý lỗi và trả về phản hồi lỗi cho ReactJS
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu sản phẩm: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
