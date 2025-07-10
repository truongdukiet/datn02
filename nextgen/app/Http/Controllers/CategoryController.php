<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Lấy danh sách tất cả các category.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Lấy tất cả các category từ database
        $categories = Category::with('products')->get();
        // Trả về danh sách dưới dạng JSON
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     * Lưu một category mới vào database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate dữ liệu đầu vào
        $request->validate([
            'Name' => 'required|string|max:255|unique:categories,Name',
            'Description' => 'nullable|string',
        ]);

        // Tạo category mới
        $category = Category::create($request->all());

        // Trả về category vừa tạo dưới dạng JSON với mã 201 (Created)
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     * Hiển thị thông tin chi tiết của một category.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Tìm category theo ID, nếu không tìm thấy sẽ tự động trả về 404
        $category = Category::with('products')->find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        // Trả về category dưới dạng JSON
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật thông tin của một category hiện có.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Tìm category theo ID
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Validate dữ liệu đầu vào, bỏ qua tên hiện tại khi kiểm tra unique
        $request->validate([
            'Name' => 'required|string|max:255|unique:categories,Name,' . $id . ',CategoryID',
            'Description' => 'nullable|string',
        ]);

        // Cập nhật thông tin category
        $category->update($request->all());

        // Trả về category đã cập nhật dưới dạng JSON
        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     * Xóa một category khỏi database.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Tìm category theo ID và xóa
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        
        $category->delete();

        // Trả về phản hồi với mã 200 và thông báo
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
