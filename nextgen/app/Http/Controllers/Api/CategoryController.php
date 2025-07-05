<?php

namespace App\Http\Controllers\Api; // Thay đổi namespace để phù hợp với thư mục Api

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
        $categories = Category::with('products')->get();
        return response()->json(['success' => true, 'data' => $categories]);
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
        $validated = $request->validate([
            'Name' => 'required|string|max:255|unique:categories,Name',
            'Description' => 'nullable|string',
        ]);
        $category = Category::create($validated);
        return response()->json(['success' => true, 'data' => $category], 201);
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
        $category = Category::with('products')->find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $category]);
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
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }
        $validated = $request->validate([
            'Name' => 'sometimes|string|max:255|unique:categories,Name,' . $id . ',CategoryID',
            'Description' => 'nullable|string',
        ]);
        $category->update($validated);
        return response()->json(['success' => true, 'data' => $category]);
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
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }
        $category->delete();
        return response()->json(['success' => true, 'message' => 'Category deleted']);
    }
}
