<?php
// File: quanly-thuoc-tinh-be/app/Http/Controllers/Api/AttributeController.php

namespace App\Http\Controllers\Api; // Namespace chỉ ra vị trí của controller

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // Import Request để nhận dữ liệu từ frontend
use App\Models\Attribute; // RẤT QUAN TRỌNG: Import Model Attribute để tương tác với database

class AttributeController extends Controller
{
    /**
     * Phương thức 'index': Xử lý yêu cầu GET /api/attributes
     * Mục đích: Lấy tất cả các thuộc tính từ database và trả về dưới dạng JSON.
     */
    public function index()
    {
        $attributes = Attribute::all(); // Lấy tất cả các bản ghi từ bảng 'attributes'
        return response()->json(['success' => true, 'data' => $attributes]);
    }

    /**
     * Phương thức 'store': Xử lý yêu cầu POST /api/attributes
     * Mục đích: Tạo một thuộc tính mới dựa trên dữ liệu gửi từ frontend.
     */
    public function store(Request $request)
    {
        // Bước 1: Xác thực dữ liệu đầu vào từ yêu cầu (validation)
        // 'name' phải là bắt buộc, là chuỗi, tối đa 255 ký tự, và phải là duy nhất trong bảng 'attributes'
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:attributes,name',
        ]);

        // Bước 2: Tạo bản ghi thuộc tính mới trong database
        $attribute = Attribute::create($validated);

        // Bước 3: Trả về phản hồi thành công và thông tin thuộc tính vừa tạo
        return response()->json(['success' => true, 'data' => $attribute], 201);
    }

    /**
     * Phương thức 'show': Xử lý yêu cầu GET /api/attributes/{id}
     * Mục đích: Lấy thông tin chi tiết của một thuộc tính theo ID.
     */
    public function show($id)
    {
        $attribute = Attribute::find($id); // Tìm thuộc tính theo ID

        if (!$attribute) { // Nếu không tìm thấy
            return response()->json(['success' => false, 'message' => 'Attribute not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $attribute]);
    }

    /**
     * Phương thức 'update': Xử lý yêu cầu PUT/PATCH /api/attributes/{id}
     * Mục đích: Cập nhật thông tin của một thuộc tính hiện có.
     */
    public function update(Request $request, $id)
    {
        $attribute = Attribute::find($id);

        if (!$attribute) {
            return response()->json(['success' => false, 'message' => 'Attribute not found'], 404);
        }

        // Xác thực dữ liệu, bỏ qua tên của chính thuộc tính đang được cập nhật để tránh lỗi unique
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:attributes,name,' . $id . ',AttributeID',
        ]);

        $attribute->update($validated); // Cập nhật thông tin
        $attribute->save(); // Lưu thay đổi vào database

        return response()->json(['success' => true, 'data' => $attribute]);
    }

    /**
     * Phương thức 'destroy': Xử lý yêu cầu DELETE /api/attributes/{id}
     * Mục đích: Xóa một thuộc tính khỏi database.
     */
    public function destroy($id)
    {
        $attribute = Attribute::find($id);

        if (!$attribute) {
            return response()->json(['success' => false, 'message' => 'Attribute not found'], 404);
        }

        $attribute->delete(); // Xóa bản ghi

        return response()->json(['success' => true, 'message' => 'Attribute deleted']);
    }
}
