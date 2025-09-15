<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VariantAttribute;

class VariantAttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $variantAttributes = VariantAttribute::with(['productVariant.product', 'attribute'])->get();
        return response()->json(['success' => true, 'data' => $variantAttributes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'AttributeID' => 'required|integer|exists:attributes,AttributeID',
            'value' => 'required|string|max:255',
        ]);
        $variantAttribute = VariantAttribute::create($validated);
        return response()->json(['success' => true, 'data' => $variantAttribute], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $variantAttribute = VariantAttribute::with(['productVariant.product', 'attribute'])->find($id);
        if (!$variantAttribute) {
            return response()->json(['success' => false, 'message' => 'Variant attribute not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $variantAttribute]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $variantAttribute = VariantAttribute::find($id);
        if (!$variantAttribute) {
            return response()->json(['success' => false, 'message' => 'Variant attribute not found'], 404);
        }
        $validated = $request->validate([
            'ProductVariantID' => 'sometimes|integer|exists:productvariants,ProductVariantID',
            'AttributeID' => 'sometimes|integer|exists:attributes,AttributeID',
            'value' => 'sometimes|string|max:255',
        ]);
        $variantAttribute->update($validated);
        return response()->json(['success' => true, 'data' => $variantAttribute]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $variantAttribute = VariantAttribute::find($id);
        if (!$variantAttribute) {
            return response()->json(['success' => false, 'message' => 'Variant attribute not found'], 404);
        }
        $variantAttribute->delete();
        return response()->json(['success' => true, 'message' => 'Variant attribute deleted']);
    }
    public function getByVariant($variantId)
    {
        $variantAttributes = VariantAttribute::with('attribute')
            ->where('ProductVariantID', $variantId)
            ->get();
        
        return response()->json([
            'success' => true, 
            'data' => $variantAttributes
        ]);
    }
}
