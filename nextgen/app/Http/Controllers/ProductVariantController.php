<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index()
    {
        return ProductVariant::all();
    }

    public function show($id)
    {
        return ProductVariant::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ProductID' => 'required|exists:products,id',
            'Sku' => 'required|string|unique:product_variants,Sku',
            'Price' => 'required|numeric',
            'Stock' => 'required|integer',
        ]);

        return ProductVariant::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->update($request->all());
        return $variant;
    }

    public function destroy($id)
    {
        ProductVariant::destroy($id);
        return response()->json(['success' => 'Product variant deleted successfully']);
    }
}