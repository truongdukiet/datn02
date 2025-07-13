<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - NextGen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p class="text-gray-600">Chào mừng bạn quay trở lại NextGen</p>
        </div>

        <!-- Success Message -->
        @if(session('success'))
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                    <p class="text-green-800">{{ session('success') }}</p>
                </div>
            </div>
        @endif

        <!-- Login Form -->
        <form method="POST" action="{{ route('login') }}" class="space-y-6">
            @csrf
            
            <!-- Email/Username -->
            <div>
                <label for="login" class="block text-sm font-medium text-gray-700 mb-2">
                    Email hoặc Tên đăng nhập
                </label>
                <input type="text" 
                       name="login" 
                       id="login" 
                       required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Nhập email hoặc tên đăng nhập">
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
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Đăng nhập
            </button>
        </form>

        <!-- Links -->
        <div class="mt-6 text-center space-y-3">
            <a href="{{ route('register') }}" class="text-blue-600 hover:text-blue-800 text-sm">
                Chưa có tài khoản? Đăng ký ngay
            </a>
            <br>
            <a href="{{ route('password.request') }}" class="text-gray-600 hover:text-gray-800 text-sm">
                Quên mật khẩu?
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