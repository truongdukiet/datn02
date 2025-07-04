<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category; // Đảm bảo bạn đã tạo Category Model

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
        $categories = Category::all();
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
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
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
        $category = Category::findOrFail($id);
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
        $category = Category::findOrFail($id);

        // Validate dữ liệu đầu vào, bỏ qua tên hiện tại khi kiểm tra unique
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
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
        $category = Category::findOrFail($id);
        $category->delete();

        // Trả về phản hồi rỗng với mã 204 (No Content)
        return response()->json(null, 204);
    }
}
