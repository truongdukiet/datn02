<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lỗi Xác thực Email - NextGen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <!-- Icon lỗi -->
        <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Xác thực Thất bại</h1>
            <p class="text-gray-600">{{ $error }}</p>
        </div>

        <!-- Thông tin chi tiết -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-start">
                <i class="fas fa-info-circle text-red-600 mt-1 mr-3"></i>
                <div>
                    <h3 class="font-semibold text-red-800 mb-1">Liên kết không hợp lệ</h3>
                    <p class="text-sm text-red-700">
                        Liên kết xác thực có thể đã hết hạn hoặc không chính xác. Vui lòng thử lại.
                    </p>
                </div>
            </div>
        </div>

        <!-- Các giải pháp -->
        <div class="space-y-3 mb-6">
            <h3 class="font-semibold text-gray-900 mb-3">Bạn có thể thử:</h3>
            <div class="flex items-center text-sm text-gray-600">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <span>Kiểm tra lại email và nhấn vào liên kết mới</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold text-xs">2</span>
                </div>
                <span>Yêu cầu gửi lại email xác thực</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold text-xs">3</span>
                </div>
                <span>Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục</span>
            </div>
        </div>

        <!-- Nút hành động -->
        <div class="space-y-3">
            <a href="/login" 
               class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Thử đăng nhập
            </a>
            
            <a href="/register" 
               class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <i class="fas fa-user-plus mr-2"></i>
                Đăng ký lại
            </a>
            
            <a href="/" 
               class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <i class="fas fa-home mr-2"></i>
                Về trang chủ
            </a>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500">
                Cần hỗ trợ? <a href="mailto:support@nextgen.com" class="text-blue-600 hover:underline">Liên hệ chúng tôi</a>
            </p>
        </div>
    </div>
</body>
</html> 