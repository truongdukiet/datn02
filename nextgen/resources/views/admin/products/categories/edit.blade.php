    <!-- resources/views/admin/categories/edit.blade.php -->
    @extends('layouts.admin')

    @section('content')
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Chỉnh sửa Danh mục: {{ $category->Name }}</h1>

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

            <form action="{{ route('admin.categories.update', $category->CategoryID) }}" method="POST" enctype="multipart/form-data" class="bg-white p-6 rounded-lg shadow-md">
                @csrf
                @method('PUT') {{-- Sử dụng phương thức PUT cho cập nhật --}}

                <div class="mb-4">
                    <label for="Name" class="block text-gray-700 text-sm font-bold mb-2">Tên Danh mục:</label>
                    <input type="text" name="Name" id="Name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="{{ old('Name', $category->Name) }}" required>
                </div>

                <div class="mb-4">
                    <label for="Description" class="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
                    <textarea name="Description" id="Description" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('Description', $category->Description) }}</textarea>
                </div>

                <div class="mb-4">
                    <label for="Image" class="block text-gray-700 text-sm font-bold mb-2">Ảnh Danh mục:</label>
                    @if ($category->Image)
                        <img src="{{ asset('storage/' . $category->Image) }}" alt="{{ $category->Name }}" class="w-24 h-24 object-cover rounded mb-2">
                        <p class="text-gray-600 text-xs mb-2">Ảnh hiện tại</p>
                    @endif
                    <input type="file" name="Image" id="Image" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <p class="text-gray-600 text-xs mt-1">Chọn ảnh mới để thay thế ảnh hiện tại (nếu có).</p>
                </div>

                <div class="mb-4">
                    <label for="Status" class="block text-gray-700 text-sm font-bold mb-2">Trạng thái:</label>
                    <input type="checkbox" name="Status" id="Status" value="1" {{ old('Status', $category->Status) ? 'checked' : '' }} class="mr-2 leading-tight">
                    <span class="text-sm">Active</span>
                </div>

                <div class="flex items-center justify-between">
                    <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Cập nhật Danh mục
                    </button>
                    <a href="{{ route('admin.categories.index') }}" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Hủy
                    </a>
                </div>
            </form>
        </div>
    @endsection
