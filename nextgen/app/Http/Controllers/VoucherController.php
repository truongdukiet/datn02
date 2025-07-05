<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VoucherController extends Controller
{
    // Lấy danh sách voucher
    public function index()
    {
        return response()->json(Voucher::all());
    }

    // Lấy chi tiết voucher
    public function show($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['message' => 'Voucher not found'], 404);
        }
        return response()->json($voucher);
    }

    // Thêm mới voucher
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Code' => 'required|unique:voucher,Code',
            'Value' => 'required|numeric',
            'Quantity' => 'required|integer',
            'Status' => 'required|boolean',
            'Description' => 'nullable|string',
            'Expiry_date' => 'required|date',
        ]);
        $voucher = Voucher::create($validated);
        return response()->json($voucher, 201);
    }

    // Cập nhật voucher
    public function update(Request $request, $id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['message' => 'Voucher not found'], 404);
        }

        $validated = $request->validate([
            'Code' => 'sometimes|required|unique:voucher,Code,' . $id . ',VoucherID',
            'Value' => 'sometimes|required|numeric',
            'Quantity' => 'sometimes|required|integer',
            'Status' => 'sometimes|required|boolean',
            'Description' => 'nullable|string',
            'Expiry_date' => 'sometimes|required|date',
        ]);

        $voucher->update($validated);

        Log::info('Voucher update request:', $request->all());

        return response()->json($voucher->fresh());
    }

    // Xóa voucher
    public function destroy($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['message' => 'Voucher not found'], 404);
        }
        $voucher->delete();
        return response()->json(['message' => 'Voucher deleted']);
    }
}
