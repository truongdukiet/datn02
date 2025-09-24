<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\User;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

class ReviewController extends Controller
{

    /**
     * Get reviews for a specific product
     */
           public function getProductReviews($productId)
    {
        try {
            // Kiểm tra product có tồn tại không
            $product = Product::find($productId);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.'
                ], 404);
            }

            // Lấy tất cả product variants của product
            $productVariants = ProductVariant::where('ProductID', $productId)->get();
            
            if ($productVariants->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'reviews' => [],
                        'statistics' => $this->getEmptyStatistics(),
                        'product_info' => [
                            'id' => $product->ProductID,
                            'name' => $product->Name,
                            'total_reviews' => 0
                        ]
                    ],
                    'message' => 'No product variants found for this product.'
                ]);
            }

            // Lấy tất cả reviews với eager loading user và productVariant
            $allReviews = Review::with(['user', 'productVariant'])
                ->whereIn('ProductVariantID', $productVariants->pluck('ProductVariantID'))
                ->get();

            // Lấy chỉ approved reviews để hiển thị
            $approvedReviews = $allReviews->where('Status', 1);

            // Chuẩn bị dữ liệu statistics
            $statistics = $this->calculateReviewStatistics($allReviews);

            // Transform reviews data for frontend
            $transformedReviews = $approvedReviews->map(function ($review) {
                return $this->transformReviewData($review);
            })->values();

            // Product info
            $productInfo = [
                'id' => $product->ProductID,
                'name' => $product->Name,
                'total_reviews' => $allReviews->count(),
                'approved_reviews' => $approvedReviews->count(),
                'average_rating' => $statistics['average_rating'],

            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'reviews' => $transformedReviews,
                    'statistics' => $statistics,
                    'product_info' => $productInfo
                ],
                'message' => 'Product reviews retrieved successfully.'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error retrieving product reviews: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product reviews: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transform review data for frontend - FIXED VERSION
     */
    private function transformReviewData($review)
    {
        // Sử dụng relationship đã được eager loaded
        $user = $review->user;
        
        return [
            'id' => $review->ReviewID,
            'user_info' => [
                'id' => $user->UserID ?? null,
                'name' => $user->Username ?? ($user->Name ?? 'Khách hàng'),
                'email' => $user->Email ?? null,
            ],
            'product_variant_id' => $review->ProductVariantID,
            'product_variant_info' => $review->productVariant ? [
                'id' => $review->productVariant->ProductVariantID,
                'name' => $review->productVariant->Name ?? 'Không xác định',
                'sku' => $review->productVariant->SKU ?? '',
                'attribute' => $review->productVariant->Attribute ?? null,

            ] : null,
            'rating' => $review->Star_rating,
            'comment' => $review->Comment,
            'created_at' => $review->Create_at ? Carbon::parse($review->Create_at)->toISOString() : null,
            'updated_at' => $review->Update_at ? Carbon::parse($review->Update_at)->toISOString() : null,
            'status' => $this->getStatusText($review->Status),
            'status_code' => $review->Status,
            'is_approved' => $review->Status == 1,
            'is_pending' => $review->Status == 0,
            'is_hidden' => $review->Status == 2
        ];
    }

    /**
     * Calculate review statistics
     */
    private function calculateReviewStatistics($reviews)
    {
        $totalReviews = $reviews->count();

        if ($totalReviews === 0) {
            return $this->getEmptyStatistics();
        }

        $totalRating = $reviews->sum('Star_rating');
        $averageRating = round($totalRating / $totalReviews, 1);

        $ratingCounts = [
            5 => $reviews->where('Star_rating', 5)->count(),
            4 => $reviews->where('Star_rating', 4)->count(),
            3 => $reviews->where('Star_rating', 3)->count(),
            2 => $reviews->where('Star_rating', 2)->count(),
            1 => $reviews->where('Star_rating', 1)->count()
        ];

        $ratingPercentages = [];
        foreach ($ratingCounts as $stars => $count) {
            $ratingPercentages[$stars] = $totalReviews > 0 ? round(($count / $totalReviews) * 100, 1) : 0;
        }

        $approvedCount = $reviews->where('Status', 1)->count();
        $pendingCount = $reviews->where('Status', 0)->count();
        $hiddenCount = $reviews->where('Status', 2)->count();

        return [
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'rating_counts' => $ratingCounts,
            'rating_percentages' => $ratingPercentages,
            'status_counts' => [
                'approved' => $approvedCount,
                'pending' => $pendingCount,
                'hidden' => $hiddenCount
            ]
        ];
    }

    /**
     * Get empty statistics structure
     */
    private function getEmptyStatistics()
    {
        return [
            'total_reviews' => 0,
            'average_rating' => 0,
            'rating_counts' => [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0],
            'rating_percentages' => [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0],
            'status_counts' => ['approved' => 0, 'pending' => 0, 'hidden' => 0]
        ];
    }

    /**
     * Get status text
     */
    private function getStatusText($statusCode)
    {
        switch ($statusCode) {
            case 1: return 'approved';
            case 2: return 'hidden';
            default: return 'pending';
        }
    }

    /**
     * Get all reviews for admin with eager loading
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'productVariant.product']);

        // Filter by status if provided
        if ($request->has('status')) {
            if ($request->status === 'approved') {
                $query->where('Status', 1);
            } elseif ($request->status === 'pending') {
                $query->where('Status', 0);
            } elseif ($request->status === 'hidden') {
                $query->where('Status', 2);
            }
        }

        $reviews = $query->orderBy('Create_at', 'desc')->get();

        $transformedReviews = $reviews->map(function ($review) {
            return $this->transformReviewData($review);
        });

        return response()->json([
            'success' => true,
            'data' => $transformedReviews,
            'message' => 'Reviews retrieved successfully.'
        ], 200);
    }

    /**
     * Get single review with eager loading
     */
    public function show($id)
    {
        $review = Review::with(['user', 'productVariant.product'])->find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }

        $transformedReview = $this->transformReviewData($review);

        return response()->json([
            'success' => true,
            'data' => $transformedReview,
            'message' => 'Review retrieved successfully.'
        ], 200);
    }
    /**
     * Create a new review
     */
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
        'Star_rating' => 'required|integer|min:1|max:5',
        'Comment' => 'required|string|min:10|max:1000',
        'UserID' => 'required|integer|exists:users,UserID',
        'Status' => 'sometimes|integer|in:0,1,2|default:1',
        'OrderDetailID' => 'sometimes|integer|exists:orderdetail,OrderDetailID'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    $userID = $request->UserID;

    // Kiểm tra xem user đã đánh giá sản phẩm này chưa
    $existingReview = Review::where('UserID', $userID)
        ->where('ProductVariantID', $request->ProductVariantID)
        ->first();

    if ($existingReview) {
        return response()->json([
            'success' => false,
            'message' => 'Bạn đã đánh giá sản phẩm này rồi.'
        ], 422);
    }

    try {
        $reviewData = [
            'UserID' => $userID,
            'ProductVariantID' => $request->ProductVariantID,
            'Star_rating' => $request->Star_rating,
            'Comment' => $request->Comment,
            'Status' => $request->Status ?? 0,
            'OrderDetailID' => $request->OrderDetailID
        ];

        // Sử dụng đúng tên cột trong database
        // Kiểm tra xem cột trong database là created_at hay Create_at
        $reviewData['created_at'] = Carbon::now();
        $reviewData['updated_at'] = Carbon::now();

        $review = Review::create($reviewData);

        // Log để debug
        \Log::info('Review created successfully:', ['review_id' => $review->ReviewID]);

        return response()->json([
            'success' => true,
            'message' => 'Đánh giá đã được gửi thành công. Đánh giá sẽ được hiển thị sau khi được phê duyệt.',
            'data' => [
                'id' => $review->ReviewID,
                'user_id' => $review->UserID,
                'product_variant_id' => $review->ProductVariantID,
                'rating' => $review->Star_rating,
                'comment' => $review->Comment,
                'status' => $review->Status,
                'created_at' => $review->created_at
            ]
        ], 201);
    } catch (\Exception $e) {
        \Log::error('Review submission error: ' . $e->getMessage());
        \Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi gửi đánh giá: ' . $e->getMessage()
        ], 500);
    }
}


    public function updateStatus(Request $request, $id)
    {


        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,pending,hidden'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $review = Review::find($id);
        
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }

        try {
            $statusValue = 0; // pending
            if ($request->status === 'approved') {
                $statusValue = 1;
            } elseif ($request->status === 'hidden') {
                $statusValue = 2;
            }

            $review->update([
                'Status' => $statusValue,
                'Update_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review status updated successfully.',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating review status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function approve($id)
    {

        $review = Review::find($id);
        
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }

        try {
            $review->update([
                'Status' => 1, // Approved
                'Update_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review approved successfully.',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error approving review: ' . $e->getMessage()
            ], 500);
        }
    }


    public function hide($id)
    {

        $review = Review::find($id);
        
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }

        try {
            $review->update([
                'Status' => 2, // Hidden
                'Update_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review hidden successfully.',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error hiding review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific review
     */
    // public function show($id)
    // {
    //     $review = Review::with(['user', 'productVariant.product'])->find($id);

    //     if (!$review) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Review not found.'
    //         ], 404);
    //     }

    //     // Transform data for frontend
    //     $userInfo = [
    //         'name' => $review->user->Name ?? 'Khách hàng',
    //         'phone' => $review->user->Phone ?? 'Chưa có số điện thoại',
    //         'email' => $review->user->Email ?? 'Chưa có email'
    //     ];

    //     $productInfo = [
    //         'id' => $review->productVariant->product->ProductID ?? null,
    //         'name' => $review->productVariant->product->Name ?? 'Sản phẩm không xác định'
    //     ];

    //     // Determine status based on Status value
    //     $status = 'pending';
    //     if ($review->Status == 1) {
    //         $status = 'approved';
    //     } elseif ($review->Status == 2) {
    //         $status = 'hidden';
    //     }

    //     $transformedReview = [
    //         'id' => $review->ReviewID,
    //         'user_info' => $userInfo,
    //         'product_info' => $productInfo,
    //         'rating' => $review->Star_rating,
    //         'comment' => $review->Comment,
    //         'created_at' => $review->Create_at,
    //         'updated_at' => $review->Update_at,
    //         'status' => $status,
    //         'is_approved' => $review->Status == 1,
    //         'is_hidden' => $review->Status == 2
    //     ];

    //     return response()->json([
    //         'success' => true,
    //         'data' => $transformedReview,
    //         'message' => 'Review retrieved successfully.'
    //     ], 200);
    // }

    /**
     * Update a review
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }


        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review->update([
                'Star_rating' => $request->rating ?? $review->Star_rating,
                'Comment' => $request->comment ?? $review->Comment,
                'Update_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review updated successfully.',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }

        try {
            $review->delete();
            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting review: ' . $e->getMessage()
            ], 500);
        }
    }
}