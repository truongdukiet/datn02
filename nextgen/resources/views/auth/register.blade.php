<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký - NextGen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h1>
            <p class="text-gray-600">Tạo tài khoản mới tại NextGen</p>
        </div>

        <!-- Register Form -->
        <form method="POST" action="{{ route('register') }}" class="space-y-6">
            @csrf
            
            <!-- Fullname -->
            <div>
                <label for="Fullname" class="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                </label>
                <input type="text" 
                       name="Fullname" 
                       id="Fullname" 
                       required 
                       value="{{ old('Fullname') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Nhập họ và tên">
                @error('Fullname')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Username -->
            <div>
                <label for="Username" class="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập
                </label>
                <input type="text" 
                       name="Username" 
                       id="Username" 
                       required 
                       value="{{ old('Username') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Nhập tên đăng nhập">
                @error('Username')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Email -->
            <div>
                <label for="Email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input type="email" 
                       name="Email" 
                       id="Email" 
                       required 
                       value="{{ old('Email') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Nhập email">
                @error('Email')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Password -->
            <div>
                <label for="Password" class="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                </label>
                <input type="password" 
                       name="Password" 
                       id="Password" 
                       required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Nhập mật khẩu">
                @error('Password')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Confirm Password -->
            <div>
                <label for="Password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                </label>
                <input type="password" 
                       name="Password_confirmation" 
                       id="Password_confirmation" 
                       required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Nhập lại mật khẩu">
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                <i class="fas fa-user-plus mr-2"></i>
                Đăng ký
            </button>
        </form>

        <!-- Links -->
        <div class="mt-6 text-center">
            <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-800 text-sm">
                Đã có tài khoản? Đăng nhập ngay
            </a>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500">
                © 2024 NextGen. Tất cả quyền được bảo lưu.
            </p>
        </div>
    </div>
</body>
</html>