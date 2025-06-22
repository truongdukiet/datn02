<?php

namespace App\Http\Controllers;

use App\Models\VariantAttribute;
use Illuminate\Http\Request;

class VariantAttributeController extends Controller
{
    public function index()
    {
        return VariantAttribute::all();
    }

    public function show($id)
    {
        return VariantAttribute::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ProductVariantID' => 'required|exists:product_variants,ProductVariantID',
            'AttributeID' => 'required|exists:attributes,AttributeID',
            'value' => 'required|string',
        ]);

        return VariantAttribute::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $attribute = VariantAttribute::findOrFail($id);
        $attribute->update($request->all());
        return $attribute;
    }

    public function destroy($id)
    {
        VariantAttribute::destroy($id);
        return response()->json(['success' => 'Variant attribute deleted successfully']);
    }
}