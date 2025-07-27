<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - NextGen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <i class="fas fa-lock text-3xl text-green-600"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
            <p class="text-gray-600">Tạo mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <!-- User Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
                <i class="fas fa-user text-blue-600 mr-3"></i>
                <div>
                    <p class="text-sm text-blue-800">
                        <strong>Tài khoản:</strong> {{ $user->Fullname }}
                    </p>
                    <p class="text-sm text-blue-700">
                        <strong>Email:</strong> {{ $user->Email }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Reset Password Form -->
        <form method="POST" action="{{ route('password.reset', ['id' => $user->UserID, 'token' => $token]) }}" class="space-y-6">
            @csrf
            
            <!-- New Password -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                </label>
                <input type="password" 
                       name="password" 
                       id="password" 
                       required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent @error('password') border-red-500 @enderror"
                       placeholder="Nhập mật khẩu mới">
                @error('password')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Confirm Password -->
            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                </label>
                <input type="password" 
                       name="password_confirmation" 
                       id="password_confirmation" 
                       required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="Nhập lại mật khẩu mới">
            </div>

            <!-- Password Requirements -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-2">Yêu cầu mật khẩu:</h3>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        Tối thiểu 6 ký tự
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        Nên có chữ hoa, chữ thường
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        Nên có số và ký tự đặc biệt
                    </li>
                </ul>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                <i class="fas fa-save mr-2"></i>
                Đặt lại mật khẩu
            </button>
        </form>

        <!-- Security Notice -->
        <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start">
                <i class="fas fa-shield-alt text-yellow-600 mt-1 mr-3"></i>
                <div>
                    <h3 class="font-semibold text-yellow-800 mb-1">Lưu ý bảo mật:</h3>
                    <p class="text-sm text-yellow-700">
                        Link này chỉ có hiệu lực trong 60 phút. Sau khi đặt lại mật khẩu, link sẽ không còn tác dụng.
                    </p>
                </div>
            </div>
        </div>

        <!-- Links -->
        <div class="mt-6 text-center">
            <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-800 text-sm">
                <i class="fas fa-arrow-left mr-1"></i>
                Quay lại đăng nhập
            </a>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500">
                © 2024 NextGen. Tất cả quyền được bảo lưu.
            </p>
        </div>
    </div>

    <!-- Password Strength Indicator -->
    <script>
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('password_confirmation');
        
        function checkPasswordMatch() {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            if (confirm && password !== confirm) {
                confirmInput.setCustomValidity('Mật khẩu không khớp');
            } else {
                confirmInput.setCustomValidity('');
            }
        }
        
        passwordInput.addEventListener('input', checkPasswordMatch);
        confirmInput.addEventListener('input', checkPasswordMatch);
    </script>
</body>
</html> 