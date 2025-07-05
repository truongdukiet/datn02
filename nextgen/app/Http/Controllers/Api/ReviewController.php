<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with(['user', 'productVariant.product'])->get();
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'OrderDetailID' => 'required|integer|exists:orderdetail,OrderDetailID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'UserID' => 'required|integer|exists:users,UserID',
            'Star_rating' => 'required|integer|min:1|max:5',
            'Comment' => 'nullable|string',
            'Image' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ]);
        $review = Review::create($validated);
        return response()->json(['success' => true, 'data' => $review], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $review = Review::with(['user', 'productVariant.product'])->find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $review]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }
        $validated = $request->validate([
            'OrderDetailID' => 'sometimes|integer|exists:orderdetail,OrderDetailID',
            'ProductVariantID' => 'sometimes|integer|exists:productvariants,ProductVariantID',
            'UserID' => 'sometimes|integer|exists:users,UserID',
            'Star_rating' => 'sometimes|integer|min:1|max:5',
            'Comment' => 'nullable|string',
            'Image' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ]);
        $review->update($validated);
        return response()->json(['success' => true, 'data' => $review]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }
        $review->delete();
        return response()->json(['success' => true, 'message' => 'Review deleted']);
    }
}
