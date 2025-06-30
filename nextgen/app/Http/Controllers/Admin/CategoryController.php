<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category; // Import Model Category
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Import Rule for unique validation

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các danh mục.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Lấy tất cả danh mục và phân trang 10 mục mỗi trang
        $categories = Category::paginate(10);
        return view('admin.categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     * Hiển thị form để tạo danh mục mới.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return view('admin.categories.create');
    }

    /**
     * Store a newly created resource in storage.
     * Lưu danh mục mới vào cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Xác thực dữ liệu đầu vào từ form
        $request->validate([
            'Name' => 'required|string|max:255|unique:categories,Name', // Tên danh mục là bắt buộc và duy nhất
            'Description' => 'nullable|string', // Mô tả có thể trống
        ]);

        // Tạo danh mục mới trong database
        Category::create([
            'Name' => $request->Name,
            'Description' => $request->Description,
            'Create_at' => now(), // Gán thời gian tạo hiện tại
            'Update_at' => now(), // Gán thời gian cập nhật hiện tại
        ]);

        // Chuyển hướng về trang danh sách danh mục với thông báo thành công
        return redirect()->route('admin.categories.index')->with('success', 'Danh mục đã được tạo thành công.');
    }

    /**
     * Show the form for editing the specified resource.
     * Hiển thị form để chỉnh sửa danh mục đã cho.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\View\View
     */
    public function edit(Category $category)
    {
        // Laravel sẽ tự động tìm danh mục dựa trên CategoryID từ URL (Route Model Binding)
        return view('admin.categories.edit', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật danh mục đã cho trong cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Category $category)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            // Tên danh mục duy nhất, bỏ qua chính danh mục đang chỉnh sửa
            'Name' => ['required', 'string', 'max:255', Rule::unique('categories', 'Name')->ignore($category->CategoryID, 'CategoryID')],
            'Description' => 'nullable|string',
        ]);

        // Cập nhật các trường thông tin
        $category->Name = $request->Name;
        $category->Description = $request->Description;
        $category->Update_at = now(); // Cập nhật thời gian cập nhật

        $category->save(); // Lưu thay đổi vào database

        return redirect()->route('admin.categories.index')->with('success', 'Danh mục đã được cập nhật thành công.');
    }

    /**
     * Remove the specified resource from storage.
     * Xóa danh mục đã cho khỏi cơ sở dữ liệu.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Category $category)
    {
        // Bạn có thể thêm logic kiểm tra xem có sản phẩm nào thuộc danh mục này không
        // trước khi cho phép xóa để tránh lỗi khóa ngoại.
        // Ví dụ: if ($category->products()->count() > 0) { ... }
        // Để sử dụng $category->products(), bạn cần đảm bảo mối quan hệ products() đã được định nghĩa trong Category Model.
        // (Nếu bạn đã tạo Category Model theo hướng dẫn của tôi, mối quan hệ này đã có)

        $category->delete(); // Xóa danh mục

        return redirect()->route('admin.categories.index')->with('success', 'Danh mục đã được xóa thành công.');
    }
}
