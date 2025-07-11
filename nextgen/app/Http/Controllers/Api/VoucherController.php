<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voucher;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::all();
        return response()->json(['success' => true, 'data' => $vouchers]);
    }

    public function show($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $voucher]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Code' => 'required|string|max:255|unique:voucher,Code',
            'Value' => 'required|numeric|min:0',
            'Quantity' => 'required|integer|min:0',
            'Status' => 'nullable|boolean',
            'Description' => 'nullable|string',
            'Expiry_date' => 'required|date',
        ]);
        $voucher = Voucher::create($validated);
        return response()->json(['success' => true, 'data' => $voucher], 201);
    }

    public function update(Request $request, $id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }
        $validated = $request->validate([
            'Code' => 'sometimes|string|max:255|unique:voucher,Code,' . $id . ',VoucherID',
            'Value' => 'sometimes|numeric|min:0',
            'Quantity' => 'sometimes|integer|min:0',
            'Status' => 'nullable|boolean',
            'Description' => 'nullable|string',
            'Expiry_date' => 'sometimes|date',
        ]);
        $voucher->update($validated);
        return response()->json(['success' => true, 'data' => $voucher]);
    }

    public function destroy($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
        }
        $voucher->delete();
        return response()->json(['success' => true, 'message' => 'Voucher deleted']);
    }
}
