    <!-- resources/views/admin/orders/index.blade.php -->
    @extends('layouts.admin') {{-- Giả sử bạn có layout admin --}}

    @section('content')
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Quản lý Đơn hàng</h1>

            @if (session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">{{ session('success') }}</span>
                </div>
            @endif
            @if (session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">{{ session('error') }}</span>
                </div>
            @endif

            <a href="{{ route('admin.orders.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Tạo Đơn hàng Mới</a>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">ID</th>
                            <th class="py-3 px-6 text-left">Người dùng</th>
                            <th class="py-3 px-6 text-left">Ngày đặt</th>
                            <th class="py-3 px-6 text-left">Tổng tiền</th>
                            <th class="py-3 px-6 text-left">Trạng thái</th>
                            <th class="py-3 px-6 text-left">Địa chỉ giao hàng</th>
                            <th class="py-3 px-6 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light">
                        @foreach ($orders as $order)
                            <tr class="border-b border-gray-200 hover:bg-gray-100">
                                <td class="py-3 px-6 text-left whitespace-nowrap">{{ $order->OrderID }}</td>
                                <td class="py-3 px-6 text-left">{{ $order->user->name ?? 'N/A' }}</td> {{-- Giả sử User có trường 'name' --}}
                                <td class="py-3 px-6 text-left">{{ $order->OrderDate }}</td>
                                <td class="py-3 px-6 text-left">{{ number_format($order->TotalAmount, 0, ',', '.') }} VND</td>
                                <td class="py-3 px-6 text-left">
                                    <span class="px-2 py-1 font-semibold leading-tight rounded-full {{ $order->Status == 'completed' ? 'bg-green-100 text-green-800' : ($order->Status == 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800') }}">
                                        {{ $order->Status }}
                                    </span>
                                </td>
                                <td class="py-3 px-6 text-left">{{ Str::limit($order->ShippingAddress, 50) }}</td>
                                <td class="py-3 px-6 text-center">
                                    <div class="flex item-center justify-center">
                                        <a href="{{ route('admin.orders.show', $order->OrderID) }}" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" title="Xem chi tiết">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </a>
                                        <a href="{{ route('admin.orders.edit', $order->OrderID) }}" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" title="Chỉnh sửa">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </a>
                                        <form action="{{ route('admin.orders.destroy', $order->OrderID) }}" method="POST" onsubmit="return confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" title="Xóa">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class="mt-4">
                {{ $orders->links() }} {{-- Hiển thị phân trang --}}
            </div>
        </div>
    @endsection
