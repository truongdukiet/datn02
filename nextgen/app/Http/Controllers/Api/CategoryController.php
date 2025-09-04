<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
        public function index()
    {
        $categories = Category::where('is_active', 1)->get();

        $data = $categories->map(function($category) {
            return [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'is_active' => $category->is_active,
                'Create_at' => $category->created_at,
                'Update_at' => $category->updated_at,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function adminIndex()
    {
        $categories = Category::all();

        $data = $categories->map(function($category) {
            return [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'is_active' => $category->is_active,
                'Create_at' => $category->created_at,
                'Update_at' => $category->updated_at,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'Name' => 'required|string|max:255|unique:categories,Name',
        'Description' => 'nullable|string',
        'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'is_active' => 'boolean'
    ]);

    // Xử lý ảnh
    if ($request->hasFile('Image')) {
        $validated['Image'] = $request->file('Image')->store('categories', 'public');
    } else {
        $validated['Image'] = null;
    }

    // Nếu không gửi kèm is_active thì mặc định = 1
    if (!isset($validated['is_active'])) {
        $validated['is_active'] = 1;
    }

    $category = Category::create($validated);

    return response()->json([
        'success' => true,
        'data' => [
            'CategoryID' => $category->CategoryID,
            'Name' => $category->Name,
            'Description' => $category->Description,
            'Image' => $category->Image,
            'is_active' => $category->is_active,
            'Created_at' => $category->created_at,
            'Updated_at' => $category->updated_at,
        ]
    ], 201);
}


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
                'is_active' => $category->is_active,
                'Create_at' => $category->Create_at,
                'Update_at' => $category->Update_at,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'Name' => 'sometimes|string|max:255|unique:categories,Name,' . $id . ',CategoryID',
            'Description' => 'nullable|string',
            'Image' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => asset('storage/' . $category->Image),
                'is_active' => $category->is_active,
                'Create_at' => $category->Create_at,
                'Update_at' => $category->updated_at,
            ]
        ]);
    }
public function toggleStatus($id)
{
    $category = Category::find($id);
    if (!$category) {
        return response()->json(['success' => false, 'message' => 'Category not found'], 404);
    }

    // Đảo trạng thái
    $category->is_active = !$category->is_active;
    $category->save();

    // Cập nhật trạng thái tất cả sản phẩm thuộc danh mục này
    \DB::table('products')
        ->where('CategoryID', $category->CategoryID)
        ->update(['Status' => $category->is_active]);

    return response()->json([
        'success' => true,
        'message' => 'Category status updated (products updated too)',
        'data' => [
            'CategoryID' => $category->CategoryID,
            'Name' => $category->Name,
            'is_active' => $category->is_active,
        ]
    ]);
}
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

        // ✅ Kiểm tra xem danh mục có sản phẩm không
        if ($category->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Danh mục này đang có sản phẩm, không thể xóa!'
            ], 400);
        }

        // Nếu không có sản phẩm thì cho phép xóa
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công'
        ], 200);

    } catch (\Exception $e) {
        // Bắt mọi lỗi khác (vd: lỗi DB)
        return response()->json([
            'success' => false,
            'message' => 'Lỗi server: ' . $e->getMessage()
        ], 500);
    }
}


}
