<?php

namespace App\Http\Controllers;

use App\Models\VariantAttribute;
use Illuminate\Http\Request;

class VariantAttributeController extends Controller
{
    public function index()
    {
        return response()->json(VariantAttribute::with('attribute')->get());
    }

    public function show($id)
    {
        $attr = VariantAttribute::with('attribute')->find($id);
        if (!$attr) return response()->json(['message' => 'Not found'], 404);
        return response()->json($attr);
    }

    public function store(Request $request)
    {
        $request->validate(['ProductVariantID' => 'required', 'AttributeID' => 'required', 'value' => 'required']);
        $attr = VariantAttribute::create($request->all());
        return response()->json($attr, 201);
    }

    public function update(Request $request, $id)
    {
        $attr = VariantAttribute::find($id);
        if (!$attr) return response()->json(['message' => 'Not found'], 404);
        $attr->update($request->all());
        return response()->json($attr);
    }

    public function destroy($id)
    {
        $attr = VariantAttribute::find($id);
        if (!$attr) return response()->json(['message' => 'Not found'], 404);
        $attr->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
