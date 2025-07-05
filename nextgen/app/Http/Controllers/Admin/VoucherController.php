<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher; // Import Model Voucher
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các voucher.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $vouchers = Voucher::paginate(10); // Lấy tất cả voucher và phân trang
        return view('admin.vouchers.index', compact('vouchers'));
    }

    /**
     * Show the form for creating a new resource.
     * Hiển thị form để tạo voucher mới.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return view('admin.vouchers.create');
    }

    /**
     * Store a newly created resource in storage.
     * Lưu voucher mới vào cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'Code' => 'required|string|max:255|unique:voucher,Code', // Code phải là duy nhất
            'Value' => 'required|numeric|min:0',
            'Quantity' => 'required|integer|min:0',
            'Status' => 'boolean',
            'Description' => 'nullable|string',
            'Expiry_date' => 'nullable|date|after_or_equal:today', // Ngày hết hạn phải là hôm nay hoặc tương lai
        ]);

        Voucher::create([
            'Code' => $request->Code,
            'Value' => $request->Value,
            'Quantity' => $request->Quantity,
            'Status' => $request->Status ?? 0, // Mặc định trạng thái là 0 (inactive)
            'Description' => $request->Description,
            'Expiry_date' => $request->Expiry_date,
            'Create_at' => now(),
            'Update_at' => now(),
        ]);

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher đã được tạo thành công.');
    }

    /**
     * Show the form for editing the specified resource.
     * Hiển thị form để chỉnh sửa voucher đã cho.
     *
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\View\View
     */
    public function edit(Voucher $voucher)
    {
        return view('admin.vouchers.edit', compact('voucher'));
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật voucher đã cho trong cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Voucher $voucher)
    {
        $request->validate([
            'Code' => ['required', 'string', 'max:255', Rule::unique('voucher', 'Code')->ignore($voucher->VoucherID, 'VoucherID')], // Code duy nhất, bỏ qua voucher hiện tại
            'Value' => 'required|numeric|min:0',
            'Quantity' => 'required|integer|min:0',
            'Status' => 'boolean',
            'Description' => 'nullable|string',
            'Expiry_date' => 'nullable|date|after_or_equal:today',
        ]);

        $voucher->Code = $request->Code;
        $voucher->Value = $request->Value;
        $voucher->Quantity = $request->Quantity;
        $voucher->Status = $request->Status ?? 0;
        $voucher->Description = $request->Description;
        $voucher->Expiry_date = $request->Expiry_date;
        $voucher->Update_at = now(); // Cập nhật thời gian cập nhật

        $voucher->save();

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher đã được cập nhật thành công.');
    }

    /**
     * Remove the specified resource from storage.
     * Xóa voucher đã cho khỏi cơ sở dữ liệu.
     *
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Voucher $voucher)
    {
        // Bạn có thể thêm logic kiểm tra xem voucher này có đang được sử dụng trong đơn hàng nào không
        // trước khi xóa để tránh lỗi khóa ngoại.
        $voucher->delete();

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher đã được xóa thành công.');
    }
}
