<?php
// app/Http/Controllers/Admin/CategoryController.php
// Đây là tệp điều khiển (Controller) chính cho việc quản lý danh mục trong khu vực Admin.

namespace App\Http\Controllers\Admin; // Dòng này định nghĩa namespace cho Controller.
                                     // Nó phải khớp với đường dẫn thư mục của tệp (Admin/CategoryController.php).

use App\Http\Controllers\Controller; // Import Controller cơ sở của Laravel. Mọi Controller đều kế thừa từ đây.
use App\Models\Category; // Import model Category để có thể tương tác với bảng 'categories' trong cơ sở dữ liệu.
use Illuminate\Http\Request; // Import class Request để lấy dữ liệu từ các yêu cầu HTTP (POST, PUT, PATCH).
use Illuminate\Support\Facades\Validator; // Import Validator để xác thực dữ liệu đầu vào từ người dùng.

class CategoryController extends Controller // Định nghĩa class Controller của chúng ta, kế thừa từ Controller cơ sở.
{
    /**
     * Lấy tất cả danh mục.
     * Xử lý yêu cầu GET đến /api/admin/categories
     *
     * @return \Illuminate\Http\JsonResponse Trả về danh sách danh mục dưới dạng JSON.
     */
    public function index() // Phương thức này xử lý việc lấy tất cả danh mục.
    {
        $categories = Category::all(); // Lấy tất cả các bản ghi từ bảng 'categories' thông qua Model Category.
        return response()->json($categories); // Trả về dữ liệu danh mục dưới dạng phản hồi JSON.
    }

    /**
     * Lưu trữ một danh mục mới.
     * Xử lý yêu cầu POST đến /api/admin/categories
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client (ví dụ: tên danh mục mới).
     * @return \Illuminate\Http\JsonResponse Trả về JSON với thông báo thành công và dữ liệu danh mục mới.
     */
    public function store(Request $request) // Phương thức này xử lý việc thêm danh mục mới.
    {
        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào từ $request.
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name', // Tên bắt buộc, là chuỗi, tối đa 255 ký tự, và phải là duy nhất trong cột 'name' của bảng 'categories'.
        ], [
            // Các thông báo lỗi tùy chỉnh nếu quy tắc xác thực không được đáp ứng.
            'name.required' => 'Tên danh mục là bắt buộc.',
            'name.unique' => 'Tên danh mục này đã tồn tại.',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu quá trình xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422); // Trả về các lỗi xác thực với mã HTTP 422 (Unprocessable Entity).
        }

        // Tạo một bản ghi danh mục mới trong cơ sở dữ liệu.
        $category = Category::create([
            'name' => $request->name, // Lấy giá trị 'name' từ yêu cầu và gán vào cột 'name'.
        ]);

        // Trả về phản hồi JSON thông báo danh mục đã được tạo thành công với mã HTTP 201 (Created).
        return response()->json(['message' => 'Danh mục đã được tạo thành công.', 'category' => $category], 201);
    }

    /**
     * Hiển thị một danh mục cụ thể.
     * Xử lý yêu cầu GET đến /api/admin/categories/{id}
     *
     * @param  int  $id ID của danh mục cần hiển thị.
     * @return \Illuminate\Http\JsonResponse Trả về dữ liệu danh mục cụ thể.
     */
    public function show($id) // Phương thức này xử lý việc lấy một danh mục theo ID.
    {
        $category = Category::find($id); // Tìm danh mục trong cơ sở dữ liệu bằng ID.

        if (!$category) { // Nếu không tìm thấy danh mục.
            return response()->json(['message' => 'Không tìm thấy danh mục.'], 404); // Trả về lỗi 404 (Not Found).
        }

        return response()->json($category); // Trả về dữ liệu danh mục dưới dạng JSON.
    }

    /**
     * Cập nhật một danh mục hiện có.
     * Xử lý yêu cầu PUT/PATCH đến /api/admin/categories/{id}
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @param  int  $id ID của danh mục cần cập nhật.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công và dữ liệu danh mục đã cập nhật.
     */
    public function update(Request $request, $id) // Phương thức này xử lý việc cập nhật danh mục.
    {
        $category = Category::find($id); // Tìm danh mục cần cập nhật bằng ID.

        if (!$category) { // Nếu không tìm thấy danh mục.
            return response()->json(['message' => 'Không tìm thấy danh mục.'], 404); // Trả về lỗi 404.
        }

        // Xác thực dữ liệu đầu vào tương tự như phương thức 'store', nhưng bỏ qua tính duy nhất của chính bản ghi hiện tại.
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $id, // 'unique:categories,name,' . $id đảm bảo tên duy nhất ngoại trừ bản ghi có ID này.
        ], [
            'name.required' => 'Tên danh mục là bắt buộc.',
            'name.unique' => 'Tên danh mục này đã tồn tại.',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422); // Trả về lỗi xác thực.
        }

        $category->name = $request->name; // Cập nhật thuộc tính 'name' của danh mục.
        $category->save(); // Lưu các thay đổi vào cơ sở dữ liệu.

        // Trả về phản hồi JSON thông báo cập nhật thành công.
        return response()->json(['message' => 'Danh mục đã được cập nhật thành công.', 'category' => $category]);
    }


}
