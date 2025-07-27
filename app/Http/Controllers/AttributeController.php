<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function index()
    {
        return Attribute::all();
    }

    public function show($id)
    {
        return Attribute::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:attributes,name',
        ]);

        return Attribute::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->update($request->all());
        return $attribute;
    }

    public function destroy($id)
    {
        Attribute::destroy($id);
        return response()->json(['success' => 'Attribute deleted successfully']);
    }
}
