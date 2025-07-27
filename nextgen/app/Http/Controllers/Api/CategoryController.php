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
        $categories = Category::all();
        $data = $categories->map(function($category) {
            return [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'Create_at' => $category->Create_at,
                'Update_at' => $category->Update_at,
            ];
        });
        return response()->json(['success' => true, 'data' => $data]);
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
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Xử lý ảnh upload
        if ($request->hasFile('Image')) {
            $imagePath = $request->file('Image')->store('categories', 'public');
            $validated['Image'] = $imagePath;
        } 
        // Xử lý ảnh mặc định (nếu gửi từ frontend)
        elseif ($request->has('Image')) {
            $imageName = basename($request->input('Image'));
            if (in_array($imageName, $this->getDefaultImages())) {
                $validated['Image'] = 'default/' . $imageName;
            }
        }

        $category = Category::create($validated);
        
        return response()->json([
            'success' => true,
            'data' => $category
        ], 201);
    }

    protected function getDefaultImages()
    {
        return [
            'default1.jpg',
            'default2.jpg',
            'default3.jpg'
        ];
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
                'Create_at' => $category->Create_at,
                'Update_at' => $category->Update_at,
            ]
        ]);
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
            'Image' => 'nullable',
        ]);
        // Xử lý upload file ảnh nếu có
        if ($request->hasFile('Image')) {
            $imagePath = $request->file('Image')->store('categories', 'public');
            $validated['Image'] = $imagePath;
        } elseif ($request->has('Image')) {
            $validated['Image'] = $request->input('Image');
        }
        $validated['Update_at'] = now();
        $category->update($validated);
        return response()->json([
            'success' => true,
            'data' => [
                'CategoryID' => $category->CategoryID,
                'Name' => $category->Name,
                'Description' => $category->Description,
                'Image' => $category->Image,
                'Create_at' => $category->Create_at,
                'Update_at' => $category->Update_at,
            ]
        ]);
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
