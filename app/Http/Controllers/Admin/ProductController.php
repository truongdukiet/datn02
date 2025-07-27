<?php
// app/Http/Controllers/ProductController.php
// Đây là tệp điều khiển (Controller) chính cho việc quản lý sản phẩm.

namespace App\Http\Controllers;

use App\Models\Product; // Import model Product để tương tác với bảng sản phẩm
use Illuminate\Http\Request; // Import Request để xử lý dữ liệu từ yêu cầu HTTP
use Illuminate\Support\Facades\Validator; // Import Validator để xác thực dữ liệu đầu vào

class ProductController extends Controller
{
    /**
     * Lấy tất cả sản phẩm.
     * Xử lý yêu cầu GET đến /api/products
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Lấy tất cả sản phẩm từ cơ sở dữ liệu
        $products = Product::all();
        // Trả về danh sách sản phẩm dưới dạng JSON
        return response()->json($products);
    }

    /**
     * Lưu trữ một sản phẩm mới.
     * Xử lý yêu cầu POST đến /api/products
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name', // Tên bắt buộc, chuỗi, tối đa 255 ký tự, duy nhất trong bảng products
            'price' => 'required|numeric|min:0', // Giá bắt buộc, số, không âm
            'category' => 'required|string|max:255', // Danh mục bắt buộc, chuỗi, tối đa 255 ký tự
        ], [
            // Thông báo lỗi tùy chỉnh cho từng quy tắc
            'name.required' => 'Product name is required.',
            'name.unique' => 'This product name already exists.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Product price must be a number.',
            'price.min' => 'Product price cannot be negative.',
            'category.required' => 'Product category is required.',
        ]);

        // Kiểm tra nếu xác thực thất bại
        if ($validator->fails()) {
            // Trả về lỗi xác thực với mã trạng thái 422 (Unprocessable Entity)
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tạo một sản phẩm mới trong cơ sở dữ liệu
        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'category' => $request->category,
        ]);

        // Trả về thông báo thành công và dữ liệu sản phẩm vừa tạo với mã trạng thái 201 (Created)
        return response()->json(['message' => 'Product created successfully.', 'product' => $product], 201);
    }

    /**
     * Hiển thị một sản phẩm cụ thể.
     * Xử lý yêu cầu GET đến /api/products/{id}
     *
     * @param  int  $id ID của sản phẩm cần hiển thị
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Tìm sản phẩm theo ID
        $product = Product::find($id);

        // Nếu không tìm thấy sản phẩm
        if (!$product) {
            // Trả về lỗi 404 (Not Found)
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Trả về dữ liệu sản phẩm dưới dạng JSON
        return response()->json($product);
    }

    /**
     * Cập nhật một sản phẩm hiện có.
     * Xử lý yêu cầu PUT/PATCH đến /api/products/{id}
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client
     * @param  int  $id ID của sản phẩm cần cập nhật
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Tìm sản phẩm theo ID
        $product = Product::find($id);

        // Nếu không tìm thấy sản phẩm
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào (loại trừ chính sản phẩm đang cập nhật khỏi kiểm tra unique)
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name,' . $id,
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
        ], [
            // Thông báo lỗi tùy chỉnh
            'name.required' => 'Product name is required.',
            'name.unique' => 'This product name already exists.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Product price must be a number.',
            'price.min' => 'Product price cannot be negative.',
            'category.required' => 'Product category is required.',
        ]);

        // Kiểm tra nếu xác thực thất bại
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cập nhật các thuộc tính của sản phẩm
        $product->name = $request->name;
        $product->price = $request->price;
        $product->category = $request->category;
        // Lưu thay đổi vào cơ sở dữ liệu
        $product->save();

        // Trả về thông báo thành công và dữ liệu sản phẩm đã cập nhật
        return response()->json(['message' => 'Product updated successfully.', 'product' => $product]);
    }

    /**
     * Xóa một sản phẩm.
     * Xử lý yêu cầu DELETE đến /api/products/{id}
     *
     * @param  int  $id ID của sản phẩm cần xóa
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Tìm sản phẩm theo ID
        $product = Product::find($id);

        // Nếu không tìm thấy sản phẩm
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Xóa sản phẩm khỏi cơ sở dữ liệu
        $product->delete();

        // Trả về thông báo thành công với mã trạng thái 200 (OK)
        return response()->json(['message' => 'Product deleted successfully.'], 200);
    }
}

// app/Models/Product.php
// Đây là model Eloquent cho bảng 'products' trong cơ sở dữ liệu.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Sử dụng HasFactory để tạo factory cho model
use Illuminate\Database\Eloquent\Model; // Kế thừa từ class Model của Laravel

class Product extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể được gán hàng loạt (mass assignable).
     * Đây là các cột trong bảng mà bạn cho phép gán giá trị thông qua phương thức `create()` hoặc khi cập nhật.
     *
     * @var array
     */
    protected $fillable = ['name', 'price', 'category'];

    /**
     * Tên bảng cơ sở dữ liệu liên kết với model này.
     * Nếu tên bảng không theo quy ước số nhiều của tên model (ví dụ: Product -> products), bạn cần định nghĩa rõ ràng.
     *
     * @var string
     */
    protected $table = 'products';
}

// database/migrations/xxxx_xx_xx_xxxxxx_create_products_table.php
// Đây là tệp migration để tạo bảng 'products' trong cơ sở dữ liệu.
// Tên tệp sẽ có ngày tháng và thời gian tạo (ví dụ: 2023_10_27_000000_create_products_table.php)

use Illuminate\Database\Migrations\Migration; // Import class Migration
use Illuminate\Database\Schema\Blueprint; // Import Blueprint để định nghĩa cấu trúc bảng
use Illuminate\Support\Facades\Schema; // Import Schema để tương tác với schema cơ sở dữ liệu

class CreateProductsTable extends Migration
{
    /**
     * Chạy các migrations.
     * Phương thức 'up' được gọi khi bạn chạy `php artisan migrate`. Nó tạo bảng.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng 'products'
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Tạo cột 'id' tự động tăng (primary key)
            $table->string('name')->unique(); // Cột 'name' kiểu chuỗi, duy nhất
            $table->decimal('price', 10, 2); // Cột 'price' kiểu số thập phân, tổng 10 chữ số, 2 chữ số sau dấu phẩy
            $table->string('category'); // Cột 'category' kiểu chuỗi
            $table->timestamps(); // Tạo hai cột 'created_at' và 'updated_at' tự động
        });
    }

    /**
     * Đảo ngược các migrations.
     * Phương thức 'down' được gọi khi bạn chạy `php artisan migrate:rollback`. Nó xóa bảng.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng 'products' nếu nó tồn tại
        Schema::dropIfExists('products');
    }
}
// routes/api.php
// Đây là tệp định nghĩa các tuyến đường API cho ứng dụng Laravel của bạn.

use Illuminate\Http\Request; // Import Request để xử lý yêu cầu HTTP
use Illuminate\Support\Facades\Route; // Import Route để định nghĩa các tuyến đường
use App\Http\Controllers\ProductController; // Import ProductController của bạn

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Đây là nơi bạn có thể đăng ký các tuyến đường API cho ứng dụng của mình. Các tuyến đường này
| được tải bởi RouteServiceProvider trong một nhóm được gán middleware "api".
|
*/

// Định nghĩa các tuyến đường API cho việc quản lý sản phẩm

// Tuyến đường để lấy tất cả sản phẩm
Route::get('/products', [ProductController::class, 'index']);

// Tuyến đường để thêm sản phẩm mới
Route::post('/products', [ProductController::class, 'store']);

// Tuyến đường để lấy một sản phẩm cụ thể theo ID
Route::get('/products/{id}', [ProductController::class, 'show']);

// Tuyến đường để cập nhật một sản phẩm hiện có (sử dụng cả PUT và PATCH)
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::patch('/products/{id}', [ProductController::class, 'update']);

// Tuyến đường để xóa một sản phẩm
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Bạn có thể giữ các tuyến đường danh mục hiện có ở đây nếu cần
// use App\Http\Controllers\CategoryController;
// Route::get('/categories', [CategoryController::class, 'index']);
// Route::post('/categories', [CategoryController::class, 'store']);
// Route::get('/categories/{id}', [CategoryController::class, 'show']);
// Route::put('/categories/{id}', [CategoryController::class, 'update']);
// Route::patch('/categories/{id}', [CategoryController::class, 'update']);
// Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
