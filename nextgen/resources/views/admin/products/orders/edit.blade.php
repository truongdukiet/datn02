    <!-- resources/views/admin/orders/edit.blade.php -->
    @extends('layouts.admin')

    @section('content')
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Chỉnh sửa Đơn hàng: {{ $order->OrderID }}</h1>

            @if ($errors->any())
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            @if (session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">{{ session('error') }}</span>
                </div>
            @endif

            <form action="{{ route('admin.orders.update', $order->OrderID) }}" method="POST" class="bg-white p-6 rounded-lg shadow-md">
                @csrf
                @method('PUT') {{-- Sử dụng phương thức PUT cho cập nhật --}}

                <div class="mb-4">
                    <label for="UserID" class="block text-gray-700 text-sm font-bold mb-2">Người dùng:</label>
                    <select name="UserID" id="UserID" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                        <option value="">Chọn người dùng</option>
                        @foreach ($users as $user)
                            <option value="{{ $user->UserID }}" {{ old('UserID', $order->UserID) == $user->UserID ? 'selected' : '' }}>{{ $user->name ?? 'Người dùng không tên' }} (ID: {{ $user->UserID }})</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-4">
                    <label for="OrderDate" class="block text-gray-700 text-sm font-bold mb-2">Ngày đặt hàng:</label>
                    <input type="date" name="OrderDate" id="OrderDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('OrderDate', $order->OrderDate ? \Carbon\Carbon::parse($order->OrderDate)->format('Y-m-d') : '') }}" required>
                </div>

                <div class="mb-4">
                    <label for="TotalAmount" class="block text-gray-700 text-sm font-bold mb-2">Tổng tiền:</label>
                    <input type="number" step="0.01" name="TotalAmount" id="TotalAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('TotalAmount', $order->TotalAmount) }}" required>
                </div>

                <div class="mb-4">
                    <label for="Status" class="block text-gray-700 text-sm font-bold mb-2">Trạng thái:</label>
                    <select name="Status" id="Status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                        <option value="pending" {{ old('Status', $order->Status) == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="processing" {{ old('Status', $order->Status) == 'processing' ? 'selected' : '' }}>Processing</option>
                        <option value="completed" {{ old('Status', $order->Status) == 'completed' ? 'selected' : '' }}>Completed</option>
                        <option value="cancelled" {{ old('Status', $order->Status) == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="ShippingAddress" class="block text-gray-700 text-sm font-bold mb-2">Địa chỉ giao hàng:</label>
                    <textarea name="ShippingAddress" id="ShippingAddress" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('ShippingAddress', $order->ShippingAddress) }}</textarea>
                </div>

                <div class="mb-4">
                    <label for="PaymentMethod" class="block text-gray-700 text-sm font-bold mb-2">Phương thức thanh toán:</label>
                    <input type="text" name="PaymentMethod" id="PaymentMethod" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('PaymentMethod', $order->PaymentMethod) }}">
                </div>

                <h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">Chi tiết Đơn hàng</h2>
                <div id="order-items-container">
                    @foreach ($order->orderDetails as $index => $item)
                        <div class="order-item bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="font-medium text-gray-700">Sản phẩm #{{ $index + 1 }}</h3>
                                <button type="button" onclick="removeOrderItem(this)" class="text-red-500 hover:text-red-700 text-sm font-bold">Xóa</button>
                            </div>
                            <div class="mb-2">
                                <label for="products_{{ $index }}_product_id" class="block text-gray-700 text-sm font-bold mb-1">Sản phẩm:</label>
                                <select name="products[{{ $index }}][product_id]" id="products_{{ $index }}_product_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                                    <option value="">Chọn sản phẩm</option>
                                    @foreach ($products as $product)
                                        <option value="{{ $product->ProductID }}" {{ old("products.$index.product_id", $item->ProductID) == $product->ProductID ? 'selected' : '' }}>{{ $product->Name }} (Giá: {{ number_format($product->base_price, 0, ',', '.') }} VND)</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="mb-2">
                                <label for="products_{{ $index }}_quantity" class="block text-gray-700 text-sm font-bold mb-1">Số lượng:</label>
                                <input type="number" name="products[{{ $index }}][quantity]" id="products_{{ $index }}_quantity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old("products.$index.quantity", $item->Quantity) }}" min="1" required>
                            </div>
                            <div class="mb-2">
                                <label for="products_{{ $index }}_price" class="block text-gray-700 text-sm font-bold mb-1">Giá mỗi sản phẩm:</label>
                                <input type="number" step="0.01" name="products[{{ $index }}][price]" id="products_{{ $index }}_price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old("products.$index.price", $item->Price) }}" min="0" required>
                            </div>
                        </div>
                    @endforeach
                    {{-- Nếu có old input nhưng không có orderDetails (ví dụ lỗi validation khi thêm mới) --}}
                    @if (old('products') && !$order->orderDetails->count())
                        @foreach (old('products') as $index => $item)
                            <div class="order-item bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="font-medium text-gray-700">Sản phẩm #{{ $index + 1 }}</h3>
                                    <button type="button" onclick="removeOrderItem(this)" class="text-red-500 hover:text-red-700 text-sm font-bold">Xóa</button>
                                </div>
                                <div class="mb-2">
                                    <label for="products_{{ $index }}_product_id" class="block text-gray-700 text-sm font-bold mb-1">Sản phẩm:</label>
                                    <select name="products[{{ $index }}][product_id]" id="products_{{ $index }}_product_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                                        <option value="">Chọn sản phẩm</option>
                                        @foreach ($products as $product)
                                            <option value="{{ $product->ProductID }}" {{ $item['product_id'] == $product->ProductID ? 'selected' : '' }}>{{ $product->Name }} (Giá: {{ number_format($product->base_price, 0, ',', '.') }} VND)</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <label for="products_{{ $index }}_quantity" class="block text-gray-700 text-sm font-bold mb-1">Số lượng:</label>
                                    <input type="number" name="products[{{ $index }}][quantity]" id="products_{{ $index }}_quantity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ $item['quantity'] }}" min="1" required>
                                </div>
                                <div class="mb-2">
                                    <label for="products_{{ $index }}_price" class="block text-gray-700 text-sm font-bold mb-1">Giá mỗi sản phẩm:</label>
                                    <input type="number" step="0.01" name="products[{{ $index }}][price]" id="products_{{ $index }}_price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ $item['price'] }}" min="0" required>
                                </div>
                            </div>
                        @endforeach
                    @endif
                </div>

                <button type="button" onclick="addOrderItem()" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6">
                    Thêm Sản phẩm vào Đơn hàng
                </button>

                <div class="flex items-center justify-between">
                    <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Cập nhật Đơn hàng
                    </button>
                    <a href="{{ route('admin.orders.index') }}" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Hủy
                    </a>
                </div>
            </form>
        </div>

        <script>
            // Xác định itemIndex ban đầu dựa trên số lượng orderDetails hiện có hoặc old input
            let itemIndex = {{ $order->orderDetails->count() > 0 ? $order->orderDetails->count() : (old('products') ? count(old('products')) : 0) }};
            const products = @json($products->map(fn($p) => ['ProductID' => $p->ProductID, 'Name' => $p->Name, 'base_price' => $p->base_price]));

            function addOrderItem() {
                const container = document.getElementById('order-items-container');
                const newItem = document.createElement('div');
                newItem.classList.add('order-item', 'bg-gray-50', 'p-4', 'rounded-lg', 'mb-3', 'border', 'border-gray-200');
                newItem.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-medium text-gray-700">Sản phẩm #${itemIndex + 1}</h3>
                        <button type="button" onclick="removeOrderItem(this)" class="text-red-500 hover:text-red-700 text-sm font-bold">Xóa</button>
                    </div>
                    <div class="mb-2">
                        <label for="products_${itemIndex}_product_id" class="block text-gray-700 text-sm font-bold mb-1">Sản phẩm:</label>
                        <select name="products[${itemIndex}][product_id]" id="products_${itemIndex}_product_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                            <option value="">Chọn sản phẩm</option>
                            ${products.map(product => `<option value="${product.ProductID}">${product.Name} (Giá: ${product.base_price.toLocaleString('vi-VN')} VND)</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-2">
                        <label for="products_${itemIndex}_quantity" class="block text-gray-700 text-sm font-bold mb-1">Số lượng:</label>
                        <input type="number" name="products[${itemIndex}][quantity]" id="products_${itemIndex}_quantity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="1" min="1" required>
                    </div>
                    <div class="mb-2">
                        <label for="products_${itemIndex}_price" class="block text-gray-700 text-sm font-bold mb-1">Giá mỗi sản phẩm:</label>
                        <input type="number" step="0.01" name="products[${itemIndex}][price]" id="products_${itemIndex}_price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="0" min="0" required>
                    </div>
                `;
                container.appendChild(newItem);
                itemIndex++;
            }

            function removeOrderItem(button) {
                button.closest('.order-item').remove();
            }
        </script>
    @endsection
