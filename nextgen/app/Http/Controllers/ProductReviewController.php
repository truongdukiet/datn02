<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ProductReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductReview::query();

        if ($request->has('product_id')) {
            $query->where('ProductID', $request->product_id);
        }

        if ($request->has('user_id')) {
            $query->where('UserID', $request->user_id);
        }

        $reviews = $query->with(['user', 'product'])
                        ->where('Status', 1)
                        ->orderBy('Create_at', 'desc')
                        ->get();

        return response()->json([
            'message' => 'Lấy danh sách đánh giá thành công.',
            'data' => $reviews
        ], 200);
    }

    public function show($id)
    {
        $review = ProductReview::with(['user', 'product'])->find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá.'], 404);
        }

        return response()->json([
            'message' => 'Lấy thông tin đánh giá thành công.',
            'data' => $review
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductID' => 'required|integer|exists:products,ProductID',
            'Star_rating' => 'required|integer|min:1|max:5',
            'Comment' => 'nullable|string|max:1000',
            'Image' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ], [
            'UserID.required' => 'ID người dùng là bắt buộc.',
            'ProductID.required' => 'ID sản phẩm là bắt buộc.',
            'Star_rating.required' => 'Số sao đánh giá là bắt buộc.',
            'Star_rating.min' => 'Số sao đánh giá phải từ 1 đến 5.',
            'Star_rating.max' => 'Số sao đánh giá phải từ 1 đến 5.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $review = ProductReview::create([
                'ProductID' => $request->ProductID,
                'UserID' => $request->UserID,
                'Star_rating' => $request->Star_rating,
                'Comment' => $request->Comment,
                'Image' => $request->Image ?? '',
                'Create_at' => Carbon::now(),
                'Status' => $request->Status ?? 1,
            ]);

            $review->load(['user', 'product']);

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

    public function update(Request $request, $id)
    {
        $review = ProductReview::find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá để cập nhật.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'Star_rating' => 'sometimes|integer|min:1|max:5',
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

            $review->load(['user', 'product']);

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

    public function destroy($id)
    {
        $review = ProductReview::find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá để xóa.'], 404);
        }

        try {
            $review->delete();

            return response()->json([
                'message' => 'Đánh giá đã được xóa thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xóa đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
