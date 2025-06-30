<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order; // Import Order Model
use App\Models\User; // Import User Model for dropdown
use App\Models\Voucher; // Import Voucher Model for dropdown
use App\Models\PaymentGateway; // Import PaymentGateway Model for dropdown
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các đơn hàng.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Get all orders and paginate, eager load related models
        $orders = Order::with(['user', 'voucher', 'paymentGateway'])->paginate(10);
        return view('admin.orders.index', compact('orders'));
    }

    /**
     * Show the form for creating a new resource.
     * Hiển thị form để tạo đơn hàng mới.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        $users = User::all();
        $vouchers = Voucher::all();
        $paymentGateways = PaymentGateway::all();
        return view('admin.orders.create', compact('users', 'vouchers', 'paymentGateways'));
    }

    /**
     * Store a newly created resource in storage.
     * Lưu đơn hàng mới vào cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'InvoiceCode' => 'required|string|max:50|unique:orders,InvoiceCode',
            'UserID' => 'required|exists:users,UserID',
            'VoucherID' => 'nullable|exists:voucher,VoucherID',
            'PaymentID' => 'nullable|exists:payment_gateway,PaymentID',
            'Status' => 'required|string|max:255', // You might want to define specific statuses
            'Total_amount' => 'required|numeric|min:0',
            'Receiver_name' => 'required|string|max:255',
            'Receiver_phone' => 'required|string|max:255',
            'Shipping_address' => 'required|string',
        ]);

        Order::create([
            'InvoiceCode' => $request->InvoiceCode,
            'UserID' => $request->UserID,
            'VoucherID' => $request->VoucherID,
            'PaymentID' => $request->PaymentID,
            'Status' => $request->Status,
            'Total_amount' => $request->Total_amount,
            'Receiver_name' => $request->Receiver_name,
            'Receiver_phone' => $request->Receiver_phone,
            'Shipping_address' => $request->Shipping_address,
            'Create_at' => now(),
            'Update_at' => now(),
        ]);

        return redirect()->route('admin.orders.index')->with('success', 'Đơn hàng đã được tạo thành công.');
    }

    /**
     * Display the specified resource.
     * Hiển thị chi tiết đơn hàng.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\View\View
     */
    public function show(Order $order)
    {
        // Eager load order details and product variants for detailed view
        $order->load(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product']);
        return view('admin.orders.show', compact('order'));
    }

    /**
     * Show the form for editing the specified resource.
     * Hiển thị form để chỉnh sửa đơn hàng đã cho.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\View\View
     */
    public function edit(Order $order)
    {
        $users = User::all();
        $vouchers = Voucher::all();
        $paymentGateways = PaymentGateway::all();
        return view('admin.orders.edit', compact('order', 'users', 'vouchers', 'paymentGateways'));
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật đơn hàng đã cho trong cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'InvoiceCode' => 'required|string|max:50|unique:orders,InvoiceCode,' . $order->OrderID . ',OrderID',
            'UserID' => 'required|exists:users,UserID',
            'VoucherID' => 'nullable|exists:voucher,VoucherID',
            'PaymentID' => 'nullable|exists:payment_gateway,PaymentID',
            'Status' => 'required|string|max:255',
            'Total_amount' => 'required|numeric|min:0',
            'Receiver_name' => 'required|string|max:255',
            'Receiver_phone' => 'required|string|max:255',
            'Shipping_address' => 'required|string',
        ]);

        $order->InvoiceCode = $request->InvoiceCode;
        $order->UserID = $request->UserID;
        $order->VoucherID = $request->VoucherID;
        $order->PaymentID = $request->PaymentID;
        $order->Status = $request->Status;
        $order->Total_amount = $request->Total_amount;
        $order->Receiver_name = $request->Receiver_name;
        $order->Receiver_phone = $request->Receiver_phone;
        $order->Shipping_address = $request->Shipping_address;
        $order->Update_at = now(); // Update the updated_at timestamp

        $order->save();

        return redirect()->route('admin.orders.index')->with('success', 'Đơn hàng đã được cập nhật thành công.');
    }

    /**
     * Remove the specified resource from storage.
     * Xóa đơn hàng đã cho khỏi cơ sở dữ liệu.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Order $order)
    {
        // Before deleting an order, you might want to delete its related order details.
        // Or set up cascade deletes in your database migration.
        // For now, let's assume cascade delete is handled or you'll manually delete.
        // Example: $order->orderDetails()->delete();

        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Đơn hàng đã được xóa thành công.');
    }
}
