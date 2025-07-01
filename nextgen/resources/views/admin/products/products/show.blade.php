    <!-- resources/views/admin/products/show.blade.php -->
    @extends('layouts.admin')

    @section('content')
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Chi tiết Sản phẩm: {{ $product->Name }}</h1>

            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">ID:</p>
                    <p class="text-gray-900">{{ $product->ProductID }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Tên Sản phẩm:</p>
                    <p class="text-gray-900">{{ $product->Name }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Danh mục:</p>
                    <p class="text-gray-900">{{ $product->category->Name ?? 'N/A' }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Mô tả:</p>
                    <p class="text-gray-900">{{ $product->Description }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Giá cơ bản:</p>
                    <p class="text-gray-900">{{ number_format($product->base_price, 0, ',', '.') }} VND</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Ảnh:</p>
                    @if ($product->Image)
                        <img src="{{ asset('storage/' . $product->Image) }}" alt="{{ $product->Name }}" class="w-32 h-32 object-cover rounded">
                    @else
                        <p class="text-gray-900">Không có ảnh</p>
                    @endif
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Trạng thái:</p>
                    <p class="text-gray-900">
                        <span class="px-2 py-1 font-semibold leading-tight rounded-full {{ $product->Status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                            {{ $product->Status ? 'Active' : 'Inactive' }}
                        </span>
                    </p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Ngày tạo:</p>
                    <p class="text-gray-900">{{ $product->Create_at }}</p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 font-bold">Ngày cập nhật:</p>
                    <p class="text-gray-900">{{ $product->Update_at }}</p>
                </div>

                <div class="flex items-center justify-between mt-6">
                    <a href="{{ route('admin.products.edit', $product->ProductID) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Chỉnh sửa
                    </a>
                    <a href="{{ route('admin.products.index') }}" class="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800">
                        Quay lại danh sách
                    </a>
                </div>
            </div>
        </div>
    @endsection
