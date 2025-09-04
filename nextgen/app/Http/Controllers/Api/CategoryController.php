<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    // ✅ Lấy tất cả danh mục
    public function index()
    {
        $categories = Category::all();

        $data = $categories->map(function($category) {
            return [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'Created_at' => $category->created_at,
                'Updated_at' => $category->updated_at,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    // ✅ Tạo mới danh mục
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:255|unique:categories,Name',
            'Description' => 'nullable|string',
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('Image')) {
            $validated['Image'] = $request->file('Image')->store('categories', 'public');
        } else {
            $validated['Image'] = null;
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'Created_at' => $category->created_at,
                'Updated_at' => $category->updated_at,
            ]
        ], 201);
    }

    // ✅ Lấy 1 danh mục
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'Created_at' => $category->created_at,
                'Updated_at' => $category->updated_at,
            ]
        ]);
    }

    // ✅ Cập nhật
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'Name' => 'sometimes|string|max:255|unique:categories,Name,' . $id . ',CategoryID',
            'Description' => 'nullable|string',
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('Image')) {
            $validated['Image'] = $request->file('Image')->store('categories', 'public');
        }

        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'Created_at' => $category->created_at,
                'Updated_at' => $category->updated_at,
            ]
        ]);
    }

    // ✅ Xóa
    public function destroy($id)
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Danh mục không tồn tại'
                ], 404);
            }

            // Nếu có sản phẩm thì không cho xóa
            if ($category->products()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Danh mục này đang có sản phẩm, không thể xóa!'
                ], 400);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa danh mục thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }
}
