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

class ReviewController extends Controller
{

    public function index(Request $request)
    {

        $query = Review::query();

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

        // Load relationships
        $reviews = $query->with(['user', 'productVariant.product'])
            ->orderBy('Create_at', 'desc')
            ->get();

        // Transform data to match frontend expectations
        $transformedReviews = $reviews->map(function ($review) {
            $userInfo = [
                'name' => $review->user->Name ?? 'Khách hàng',
                'phone' => $review->user->Phone ?? 'Chưa có số điện thoại',
                'email' => $review->user->Email ?? 'Chưa có email'
            ];

            $productInfo = [
                'id' => $review->productVariant->product->ProductID ?? null,
                'name' => $review->productVariant->product->Name ?? 'Sản phẩm không xác định'
            ];

            // Determine status based on Status value
            $status = 'pending';
            if ($review->Status == 1) {
                $status = 'approved';
            } elseif ($review->Status == 2) {
                $status = 'hidden';
            }

            return [
                'id' => $review->ReviewID,
                'user_info' => $userInfo,
                'product_info' => $productInfo,
                'rating' => $review->Star_rating,
                'comment' => $review->Comment,
                'created_at' => $review->Create_at,
                'updated_at' => $review->Update_at,
                'status' => $status,
                'is_approved' => $review->Status == 1,
                'is_hidden' => $review->Status == 2
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedReviews,
            'message' => 'Reviews retrieved successfully.'
        ], 200);
    }

    /**
     * Get reviews for a specific product
     */
    public function getProductReviews($productId)
    {
        try {
            // Debug: Kiểm tra product variants có tồn tại không
            $productVariants = ProductVariant::where('ProductID', $productId)->get();
            if ($productVariants->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No product variants found for this product.'
                ]);
            }

            // Debug: Kiểm tra reviews có tồn tại không (không phân biệt status)
            $allReviews = Review::whereIn('ProductVariantID', $productVariants->pluck('ProductVariantID'))->get();
            
            // Get only approved reviews (Status = 1)
            $reviews = Review::with(['user'])
                ->whereIn('ProductVariantID', $productVariants->pluck('ProductVariantID'))
                ->where('Status', 1)
                ->orderBy('Create_at', 'desc')
                ->get();

            // Debug: Log số lượng reviews tìm thấy
            \Log::info("Found {$reviews->count()} reviews for product ID: {$productId}");

            // Transform data for frontend
            $transformedReviews = $reviews->map(function ($review) {
                return [
                    'id' => $review->ReviewID,
                    'user_info' => [
                        'name' => $review->user->Name ?? 'Khách hàng',
                        'avatar' => $review->user->Avatar ?? null
                    ],
                    'rating' => $review->Star_rating,
                    'comment' => $review->Comment,
                    'created_at' => $review->Create_at,
                    'status' => 'approved'
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedReviews,
                'message' => 'Product reviews retrieved successfully.',
                'debug' => [
                    'product_variants_count' => $productVariants->count(),
                    'all_reviews_count' => $allReviews->count(),
                    'approved_reviews_count' => $reviews->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product reviews: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new review
     */
    public function store(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to submit a review.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,ProductID',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        // Check if user has already reviewed this product
        $existingReview = Review::where('UserID', $user->UserID)
            ->whereHas('productVariant', function($query) use ($request) {
                $query->where('ProductID', $request->product_id);
            })
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.'
            ], 422);
        }

        // Get the default variant for the product
        $defaultVariant = ProductVariant::where('ProductID', $request->product_id)
            ->orderBy('ProductVariantID')
            ->first();

        if (!$defaultVariant) {
            return response()->json([
                'success' => false,
                'message' => 'No variants found for this product.'
            ], 404);
        }

        try {
            $review = Review::create([
                'UserID' => $user->UserID,
                'ProductVariantID' => $defaultVariant->ProductVariantID,
                'Star_rating' => $request->rating,
                'Comment' => $request->comment,
                'Status' => 0, // Default to pending approval
                'Create_at' => Carbon::now(),
                'Update_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully. It will be visible after approval.',
                'data' => $review
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error submitting review: ' . $e->getMessage()
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
    public function show($id)
    {
        $review = Review::with(['user', 'productVariant.product'])->find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.'
            ], 404);
        }

        // Transform data for frontend
        $userInfo = [
            'name' => $review->user->Name ?? 'Khách hàng',
            'phone' => $review->user->Phone ?? 'Chưa có số điện thoại',
            'email' => $review->user->Email ?? 'Chưa có email'
        ];

        $productInfo = [
            'id' => $review->productVariant->product->ProductID ?? null,
            'name' => $review->productVariant->product->Name ?? 'Sản phẩm không xác định'
        ];

        // Determine status based on Status value
        $status = 'pending';
        if ($review->Status == 1) {
            $status = 'approved';
        } elseif ($review->Status == 2) {
            $status = 'hidden';
        }

        $transformedReview = [
            'id' => $review->ReviewID,
            'user_info' => $userInfo,
            'product_info' => $productInfo,
            'rating' => $review->Star_rating,
            'comment' => $review->Comment,
            'created_at' => $review->Create_at,
            'updated_at' => $review->Update_at,
            'status' => $status,
            'is_approved' => $review->Status == 1,
            'is_hidden' => $review->Status == 2
        ];

        return response()->json([
            'success' => true,
            'data' => $transformedReview,
            'message' => 'Review retrieved successfully.'
        ], 200);
    }

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