    <!-- resources/views/admin/vouchers/create.blade.php -->
    @extends('layouts.admin')

    @section('content')
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Thêm Mã giảm giá Mới</h1>

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

            <form action="{{ route('admin.vouchers.store') }}" method="POST" class="bg-white p-6 rounded-lg shadow-md">
                @csrf

                <div class="mb-4">
                    <label for="Code" class="block text-gray-700 text-sm font-bold mb-2">Mã giảm giá:</label>
                    <input type="text" name="Code" id="Code" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('Code') }}" required>
                </div>

                <div class="mb-4">
                    <label for="DiscountAmount" class="block text-gray-700 text-sm font-bold mb-2">Số tiền/Phần trăm giảm:</label>
                    <input type="number" step="0.01" name="DiscountAmount" id="DiscountAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('DiscountAmount') }}" required>
                </div>

                <div class="mb-4">
                    <label for="DiscountType" class="block text-gray-700 text-sm font-bold mb-2">Loại giảm giá:</label>
                    <select name="DiscountType" id="DiscountType" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                        <option value="fixed" {{ old('DiscountType') == 'fixed' ? 'selected' : '' }}>Cố định (VND)</option>
                        <option value="percentage" {{ old('DiscountType') == 'percentage' ? 'selected' : '' }}>Phần trăm (%)</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="MinOrderAmount" class="block text-gray-700 text-sm font-bold mb-2">Giá trị đơn hàng tối thiểu (nếu có):</label>
                    <input type="number" step="0.01" name="MinOrderAmount" id="MinOrderAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('MinOrderAmount') }}">
                </div>

                <div class="mb-4">
                    <label for="MaxDiscountAmount" class="block text-gray-700 text-sm font-bold mb-2">Số tiền giảm tối đa (nếu là %):</label>
                    <input type="number" step="0.01" name="MaxDiscountAmount" id="MaxDiscountAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('MaxDiscountAmount') }}">
                </div>

                <div class="mb-4">
                    <label for="UsageLimit" class="block text-gray-700 text-sm font-bold mb-2">Giới hạn số lần sử dụng (để trống nếu không giới hạn):</label>
                    <input type="number" name="UsageLimit" id="UsageLimit" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('UsageLimit') }}">
                </div>

                <div class="mb-4">
                    <label for="ExpiryDate" class="block text-gray-700 text-sm font-bold mb-2">Ngày hết hạn (để trống nếu không có):</label>
                    <input type="date" name="ExpiryDate" id="ExpiryDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('ExpiryDate') }}">
                </div>

                <div class="mb-4">
                    <label for="Status" class="block text-gray-700 text-sm font-bold mb-2">Trạng thái:</label>
                    <input type="checkbox" name="Status" id="Status" value="1" {{ old('Status') ? 'checked' : '' }} class="mr-2 leading-tight">
                    <span class="text-sm">Active</span>
                </div>

                <div class="flex items-center justify-between">
                    <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Thêm Mã giảm giá
                    </button>
                    <a href="{{ route('admin.vouchers.index') }}" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Hủy
                    </a>
                </div>
            </form>
        </div>
    @endsection
