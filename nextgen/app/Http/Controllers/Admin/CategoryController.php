<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category; // Import Model Category
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Import Rule for unique validation
use Illuminate\Validation\ValidationException; // Import ValidationException để bắt lỗi xác thực

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các danh mục dưới dạng JSON.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Lấy tất cả danh mục. Bạn có thể thêm phân trang nếu muốn,
        // nhưng với API, thường frontend sẽ yêu cầu phân trang cụ thể.
        // Ví dụ: $categories = Category::paginate(10);
        $categories = Category::all();
        return response()->json($categories); // Trả về danh sách danh mục dưới dạng JSON
    }

    /**
     * Show the form for creating a new resource.
     * Phương thức này không cần thiết cho API. Frontend (ReactJS) sẽ tự tạo form.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create()
    {
        // Trả về 404 hoặc thông báo rằng endpoint này không dùng cho API form
        return response()->json(['message' => 'Endpoint này không được sử dụng để hiển thị form tạo danh mục cho API.'], 404);
    }

    /**
     * Store a newly created resource in storage.
     * Lưu danh mục mới vào cơ sở dữ liệu và trả về JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào từ request
            $validatedData = $request->validate([
                'Name' => 'required|string|max:255|unique:categories,Name', // Tên danh mục là bắt buộc và duy nhất
                'Description' => 'nullable|string', // Mô tả có thể trống
            ]);

            // Tạo danh mục mới trong database
            // Laravel tự động quản lý `created_at` và `updated_at` nếu bạn không tắt timestamps trong model.
            $category = Category::create([
                'Name' => $validatedData['Name'],
                'Description' => $validatedData['Description'],
                // 'Create_at' và 'Update_at' thường được Laravel tự động quản lý.
                // Nếu tên cột của bạn là 'Create_at' và 'Update_at' thay vì 'created_at' và 'updated_at',
                // bạn cần cấu hình trong Category Model hoặc gán thủ công như bạn đã làm.
                // VD: protected $dates = ['Create_at', 'Update_at']; và $timestamps = false;
                // Hoặc: 'Create_at' => now(), 'Update_at' => now(),
            ]);

            // Trả về danh mục vừa tạo với mã trạng thái 201 Created
            return response()->json([
                'message' => 'Danh mục đã được tạo thành công.',
                'category' => $category
            ], 201);

        } catch (ValidationException $e) {
            // Bắt lỗi xác thực và trả về JSON với mã trạng thái 422 Unprocessable Entity
            return response()->json([
                'message' => 'Dữ liệu đầu vào không hợp lệ.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Bắt các lỗi khác và trả về JSON với mã trạng thái 500 Internal Server Error
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi tạo danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * Hiển thị một danh mục cụ thể dưới dạng JSON.
     * Phương thức này thay thế vai trò của `edit` trong API.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Category $category)
    {
        // Laravel sẽ tự động tìm danh mục dựa trên CategoryID từ URL (Route Model Binding)
        return response()->json($category); // Trả về thông tin danh mục dưới dạng JSON
    }

    /**
     * Show the form for editing the specified resource.
     * Tương tự như `create`, phương thức này không cần thiết cho API.
     * Frontend (ReactJS) sẽ lấy dữ liệu bằng `show` và tự hiển thị form chỉnh sửa.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit(Category $category)
    {
        // Trả về 404 hoặc thông báo rằng endpoint này không dùng cho API form
        return response()->json(['message' => 'Endpoint này không được sử dụng để hiển thị form chỉnh sửa cho API. Hãy sử dụng GET /api/admin/categories/{id} để lấy dữ liệu.'], 404);
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật danh mục đã cho trong cơ sở dữ liệu và trả về JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Category $category)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $validatedData = $request->validate([
                // Tên danh mục duy nhất, bỏ qua chính danh mục đang chỉnh sửa
                'Name' => ['required', 'string', 'max:255', Rule::unique('categories', 'Name')->ignore($category->CategoryID, 'CategoryID')],
                'Description' => 'nullable|string',
            ]);

            // Cập nhật các trường thông tin
            $category->Name = $validatedData['Name'];
            $category->Description = $validatedData['Description'];
            // Laravel tự động quản lý `updated_at` nếu bạn không tắt timestamps
            // Nếu bạn muốn gán thủ công: $category->Update_at = now();

            $category->save(); // Lưu thay đổi vào database

            return response()->json([
                'message' => 'Danh mục đã được cập nhật thành công.',
                'category' => $category
            ]);

        } catch (ValidationException $e) {
            // Bắt lỗi xác thực và trả về JSON với mã trạng thái 422 Unprocessable Entity
            return response()->json([
                'message' => 'Dữ liệu đầu vào không hợp lệ.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Bắt các lỗi khác và trả về JSON với mã trạng thái 500 Internal Server Error
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Xóa danh mục đã cho khỏi cơ sở dữ liệu và trả về JSON.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Category $category)
    {
        try {
            // Bạn có thể thêm logic kiểm tra xem có sản phẩm nào thuộc danh mục này không
            // trước khi cho phép xóa để tránh lỗi khóa ngoại.
            // Ví dụ:
            // if ($category->products()->count() > 0) {
            //     return response()->json(['message' => 'Không thể xóa danh mục vì có sản phẩm liên quan.'], 409); // 409 Conflict
            // }

            $category->delete(); // Xóa danh mục

            // Trả về mã trạng thái 200 OK với thông báo thành công
            // Hoặc 204 No Content nếu không muốn trả về nội dung nào sau khi xóa thành công.
            return response()->json(['message' => 'Danh mục đã được xóa thành công.'], 200);
        } catch (\Exception $e) {
            // Bắt các lỗi khác (ví dụ: lỗi khóa ngoại nếu không kiểm tra trước)
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xóa danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
