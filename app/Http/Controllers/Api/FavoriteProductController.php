<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FavoriteProduct;

class FavoriteProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($userId)
    {
        $favorites = FavoriteProduct::with(['productVariant.product'])
            ->where('UserID', $userId)
            ->get();
        return response()->json(['success' => true, 'data' => $favorites]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
        ]);
        // Tránh trùng lặp
        $exists = FavoriteProduct::where('UserID', $validated['UserID'])
            ->where('ProductVariantID', $validated['ProductVariantID'])
            ->exists();
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Already favorited'], 409);
        }
        $favorite = FavoriteProduct::create($validated);
        return response()->json(['success' => true, 'data' => $favorite], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
        ]);
        $favorite = FavoriteProduct::where('UserID', $validated['UserID'])
            ->where('ProductVariantID', $validated['ProductVariantID'])
            ->first();
        if (!$favorite) {
            return response()->json(['success' => false, 'message' => 'Favorite not found'], 404);
        }
        $favorite->delete();
        return response()->json(['success' => true, 'message' => 'Favorite deleted']);
    }
}
