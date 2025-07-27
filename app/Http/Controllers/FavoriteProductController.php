<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Các dòng 'use' cần thiết đã được thêm vào đây
use App\Models\FavoriteProduct;
use App\Models\ProductVariant;
use App\Models\User; // Dù không trực tiếp dùng User trong controller, nó tốt cho mối quan hệ
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class FavoriteProductController extends Controller
{
    /**
     * Lấy tất cả sản phẩm yêu thích của một người dùng.
     * GET /api/favorite-products/{UserID}
     */
    public function index($userId)
    {
        // Tìm tất cả sản phẩm yêu thích của người dùng với thông tin chi tiết của ProductVariant và Product
        $favoriteProducts = FavoriteProduct::where('UserID', $userId)
                                            ->with(['productVariant.product']) // eagerly load relationships
                                            ->get();

        if ($favoriteProducts->isEmpty()) {
            return response()->json([
                'message' => 'Không tìm thấy sản phẩm yêu thích nào cho người dùng này.',
                'data' => []
            ], 404);
        }

        return response()->json([
            'message' => 'Lấy danh sách sản phẩm yêu thích thành công.',
            'data' => $favoriteProducts
        ], 200);
    }

    /**
     * Thêm một sản phẩm vào danh sách yêu thích.
     * POST /api/favorite-products
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
        ], [
            'UserID.required' => 'ID người dùng là bắt buộc.',
            'UserID.integer' => 'ID người dùng phải là số nguyên.',
            'UserID.exists' => 'ID người dùng không tồn tại.',
            'ProductVariantID.required' => 'ID biến thể sản phẩm là bắt buộc.',
            'ProductVariantID.integer' => 'ID biến thể sản phẩm phải là số nguyên.',
            'ProductVariantID.exists' => 'ID biến thể sản phẩm không tồn tại.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $userID = $request->UserID;
        $productVariantID = $request->ProductVariantID;

        // Kiểm tra xem sản phẩm đã được yêu thích bởi người dùng này chưa
        $existingFavorite = FavoriteProduct::where('UserID', $userID)
                                            ->where('ProductVariantID', $productVariantID)
                                            ->first();

        if ($existingFavorite) {
            return response()->json([
                'message' => 'Sản phẩm này đã có trong danh sách yêu thích của bạn rồi.'
            ], 409); // 409 Conflict
        }

        try {
            $favoriteProduct = FavoriteProduct::create([
                'UserID' => $userID,
                'ProductVariantID' => $productVariantID,
                'Create_at' => Carbon::now(), // Tự động thêm thời gian hiện tại
            ]);

            // Sau khi tạo, load thông tin chi tiết của sản phẩm biến thể và sản phẩm chính
            $favoriteProduct->load(['productVariant.product']);

            return response()->json([
                'message' => 'Thêm sản phẩm vào danh sách yêu thích thành công.',
                'data' => $favoriteProduct
            ], 201); // 201 Created
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm sản phẩm vào danh sách yêu thích.',
                'error' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }

    /**
     * Xóa một sản phẩm khỏi danh sách yêu thích.
     * DELETE /api/favorite-products (dùng body với UserID và ProductVariantID)
     * Hoặc DELETE /api/favorite-products/{FavoriteProductID} (nếu client biết FavoriteProductID)
     */
    public function destroy(Request $request)
    {
        // Cách 1: Xóa dựa trên UserID và ProductVariantID (thường dùng hơn trong trường hợp này)
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
        ], [
            'UserID.required' => 'ID người dùng là bắt buộc.',
            'UserID.integer' => 'ID người dùng phải là số nguyên.',
            'UserID.exists' => 'ID người dùng không tồn tại.',
            'ProductVariantID.required' => 'ID biến thể sản phẩm là bắt buộc.',
            'ProductVariantID.integer' => 'ID biến thể sản phẩm phải là số nguyên.',
            'ProductVariantID.exists' => 'ID biến thể sản phẩm không tồn tại.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $favoriteProduct = FavoriteProduct::where('UserID', $request->UserID)
                                          ->where('ProductVariantID', $request->ProductVariantID)
                                          ->first();

        if (!$favoriteProduct) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm yêu thích này để xóa.'], 404);
        }

        try {
            $favoriteProduct->delete();
            return response()->json(['message' => 'Sản phẩm đã được xóa khỏi danh sách yêu thích thành công.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xóa sản phẩm khỏi danh sách yêu thích.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /*
     * Phương thức thay thế để xóa dựa trên FavoriteProductID trực tiếp.
     * DELETE /api/favorite-products/{FavoriteProductID}
     * Bạn cần điều chỉnh routes/api.php nếu muốn sử dụng phương thức này.
     */
    public function destroyById($favoriteProductId)
    {
        $favoriteProduct = FavoriteProduct::find($favoriteProductId);

        if (!$favoriteProduct) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm yêu thích này để xóa.'], 404);
        }

        try {
            $favoriteProduct->delete();
            return response()->json(['message' => 'Sản phẩm đã được xóa khỏi danh sách yêu thích thành công.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xóa sản phẩm khỏi danh sách yêu thích.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
