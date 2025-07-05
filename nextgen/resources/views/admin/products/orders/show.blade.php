    <!-- resources/views/admin/orders/show.blade.php -->
    @extends('layouts.admin')

    @section('content')
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Chi tiết Đơn hàng: {{ $order->OrderID }}</h1>

            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">ID Đơn hàng:</p>
                    <p class="text-gray-900">{{ $order->OrderID }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Người dùng:</p>
                    <p class="text-gray-900">{{ $order->user->name ?? 'N/A' }} (ID: {{ $order->UserID }})</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Ngày đặt hàng:</p>
                    <p class="text-gray-900">{{ $order->OrderDate }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Tổng tiền:</p>
                    <p class="text-gray-900">{{ number_format($order->TotalAmount, 0, ',', '.') }} VND</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Trạng thái:</p>
                    <p class="text-gray-900">
                        <span class="px-2 py-1 font-semibold leading-tight rounded-full {{ $order->Status == 'completed' ? 'bg-green-100 text-green-800' : ($order->Status == 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800') }}">
                            {{ $order->Status }}
                        </span>
                    </p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Địa chỉ giao hàng:</p>
                    <p class="text-gray-900">{{ $order->ShippingAddress }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Phương thức thanh toán:</p>
                    <p class="text-gray-900">{{ $order->PaymentMethod }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Ngày tạo:</p>
                    <p class="text-gray-900">{{ $order->Create_at }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Ngày cập nhật:</p>
                    <p class="text-gray-900">{{ $order->Update_at }}</p>
                </div>

                <h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">Sản phẩm trong Đơn hàng</h2>
                @if ($order->orderDetails->count() > 0)
                    <div class="overflow-x-auto mb-6">
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                    <th class="py-3 px-6 text-left">Sản phẩm</th>
                                    <th class="py-3 px-6 text-left">Số lượng</th>
                                    <th class="py-3 px-6 text-left">Giá mỗi sản phẩm</th>
                                    <th class="py-3 px-6 text-left">Tổng cộng</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-600 text-sm font-light">
                                @foreach ($order->orderDetails as $detail)
                                    <tr class="border-b border-gray-200 hover:bg-gray-100">
                                        <td class="py-3 px-6 text-left">{{ $detail->product->Name ?? 'Sản phẩm không tồn tại' }}</td>
                                        <td class="py-3 px-6 text-left">{{ $detail->Quantity }}</td>
                                        <td class="py-3 px-6 text-left">{{ number_format($detail->Price, 0, ',', '.') }} VND</td>
                                        <td class="py-3 px-6 text-left">{{ number_format($detail->Quantity * $detail->Price, 0, ',', '.') }} VND</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <p class="text-gray-600">Đơn hàng này không có sản phẩm nào.</p>
                @endif

                <div class="flex items-center justify-between mt-6">
                    <a href="{{ route('admin.orders.edit', $order->OrderID) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Chỉnh sửa
                    </a>
                    <a href="{{ route('admin.orders.index') }}" class="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800">
                        Quay lại danh sách
                    </a>
                </div>
            </div>
        </div>
    @endsection
