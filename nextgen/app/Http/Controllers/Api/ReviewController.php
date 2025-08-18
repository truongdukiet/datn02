<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    // Lấy danh sách review
    public function index()
    {
        $reviews = Review::with(['user', 'productVariant.product'])->get();
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    // Thêm review mới
    public function store(Request $request)
    {
        // Không cần UserID từ request nữa, vì backend tự lấy hoặc null
        $validated = $request->validate([
            'OrderDetailID' => 'required|integer|exists:orderdetail,OrderDetailID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'Star_rating' => 'required|integer|min:1|max:5',
            'Comment' => 'nullable|string',
            'Image' => 'nullable|string|max:255',
        ]);

        // Nếu người dùng đã đăng nhập thì tự gán, còn nếu không thì có thể null
        if (auth()->check()) {
            $validated['UserID'] = auth()->id();
        }

        $review = Review::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Review created successfully',
            'data' => $review
        ], 201);
    }

    // Xem 1 review
    public function show($id)
    {
        $review = Review::with(['user', 'productVariant.product'])->find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $review]);
    }

    // Cập nhật review
    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }

        $validated = $request->validate([
            'OrderDetailID' => 'sometimes|integer|exists:orderdetail,OrderDetailID',
            'ProductVariantID' => 'sometimes|integer|exists:productvariants,ProductVariantID',
            'Star_rating' => 'sometimes|integer|min:1|max:5',
            'Comment' => 'nullable|string',
            'Image' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ]);

        if(auth()->check()) {
            $validated['UserID'] = auth()->id();
        }

        $review->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review
        ]);
    }

    // Xoá review
    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }
        $review->delete();
        return response()->json([
            'success' => true,
            'message' => 'Review deleted'
        ]);
    }
}
