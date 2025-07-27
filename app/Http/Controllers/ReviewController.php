<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review; // Import Model Review
use App\Models\User; // Import Model User (cho validator và mối quan hệ)
use App\Models\ProductVariant; // Import Model ProductVariant (cho validator và mối quan hệ)
use App\Models\OrderDetail; // Import Model OrderDetail (cho validator và mối quan hệ)
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; // Dùng để lấy thời gian hiện tại

class ReviewController extends Controller
{
    /**
     * Lấy tất cả các đánh giá (Reviews).
     * Có thể lọc theo ProductVariantID hoặc UserID.
     * GET /api/reviews
     * GET /api/reviews?product_variant_id=1
     * GET /api/reviews?user_id=1
     * GET /api/reviews?product_variant_id=1&user_id=1
     */
    public function index(Request $request)
    {
        $query = Review::query();

        // Lọc theo ProductVariantID
        if ($request->has('product_variant_id')) {
            $query->where('ProductVariantID', $request->product_variant_id);
        }

        // Lọc theo UserID
        if ($request->has('user_id')) {
            $query->where('UserID', $request->user_id);
        }

        // Tải thông tin User và ProductVariant liên quan
        $reviews = $query->with(['user', 'productVariant', 'orderDetail'])->get();

        if ($reviews->isEmpty()) {
            return response()->json([
                'message' => 'Không tìm thấy đánh giá nào.',
                'data' => []
            ], 404);
        }

        return response()->json([
            'message' => 'Lấy danh sách đánh giá thành công.',
            'data' => $reviews
        ], 200);
    }

    /**
     * Lấy một đánh giá cụ thể theo ID.
     * GET /api/reviews/{ReviewID}
     */
    public function show($id)
    {
        $review = Review::with(['user', 'productVariant', 'orderDetail'])->find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá.'], 404);
        }

        return response()->json([
            'message' => 'Lấy thông tin đánh giá thành công.',
            'data' => $review
        ], 200);
    }

    /**
     * Thêm một đánh giá mới.
     * POST /api/reviews
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'OrderDetailID' => 'nullable|integer|exists:orderdetail,OrderDetailID', // Có thể null
            'Star_rating' => 'required|integer|min:1|max:5',
            'Comment' => 'nullable|string|max:1000',
            'Image' => 'nullable|string|max:255', // Giả định là URL ảnh
            'Status' => 'nullable|boolean', // tinyint(1) được coi là boolean
        ], [
            'UserID.required' => 'ID người dùng là bắt buộc.',
            'ProductVariantID.required' => 'ID biến thể sản phẩm là bắt buộc.',
            'Star_rating.required' => 'Số sao đánh giá là bắt buộc.',
            'Star_rating.min' => 'Số sao đánh giá phải từ 1 đến 5.',
            'Star_rating.max' => 'Số sao đánh giá phải từ 1 đến 5.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này thông qua OrderDetailID cụ thể chưa
        // (Nếu bạn muốn mỗi OrderDetail chỉ được đánh giá một lần)
        if ($request->filled('OrderDetailID')) {
            $existingReview = Review::where('UserID', $request->UserID)
                                    ->where('ProductVariantID', $request->ProductVariantID)
                                    ->where('OrderDetailID', $request->OrderDetailID)
                                    ->first();
            if ($existingReview) {
                return response()->json(['message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng cụ thể này rồi.'], 409);
            }
        } else {
             // Nếu không có OrderDetailID, bạn có thể kiểm tra xem User đã đánh giá ProductVariant này chưa
             // tùy thuộc vào business logic của bạn (VD: chỉ cho phép 1 đánh giá tổng thể cho mỗi sản phẩm)
             // $existingReview = Review::where('UserID', $request->UserID)
             //                        ->where('ProductVariantID', $request->ProductVariantID)
             //                        ->whereNull('OrderDetailID') // Đánh giá chung
             //                        ->first();
             // if ($existingReview) {
             //     return response()->json(['message' => 'Bạn đã đánh giá sản phẩm này rồi.'], 409);
             // }
        }


        try {
            $review = Review::create([
                'OrderDetailID' => $request->OrderDetailID,
                'ProductVariantID' => $request->ProductVariantID,
                'UserID' => $request->UserID,
                'Star_rating' => $request->Star_rating,
                'Comment' => $request->Comment,
                'Image' => $request->Image ?? '', // Đảm bảo Image không null theo DB
                'Create_at' => Carbon::now(),
                'Status' => $request->Status ?? 1, // Mặc định là 1 (active) nếu không cung cấp
            ]);

            $review->load(['user', 'productVariant', 'orderDetail']);

            return response()->json([
                'message' => 'Đánh giá đã được thêm thành công.',
                'data' => $review
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật một đánh giá.
     * PUT/PATCH /api/reviews/{ReviewID}
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá để cập nhật.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'Star_rating' => 'sometimes|integer|min:1|max:5', // 'sometimes' nghĩa là không bắt buộc phải có
            'Comment' => 'nullable|string|max:1000',
            'Image' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $review->update($request->only([
                'Star_rating',
                'Comment',
                'Image',
                'Status',
            ]));

            $review->load(['user', 'productVariant', 'orderDetail']); // Load lại quan hệ sau khi update

            return response()->json([
                'message' => 'Đánh giá đã được cập nhật thành công.',
                'data' => $review
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa một đánh giá.
     * DELETE /api/reviews/{ReviewID}
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá để xóa.'], 404);
        }

        try {
            $review->delete();
            return response()->json(['message' => 'Đánh giá đã được xóa thành công.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xóa đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
