<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực Email Thành công - NextGen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <!-- Icon thành công -->
        <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <i class="fas fa-check text-3xl text-green-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Xác thực Thành công!</h1>
            <p class="text-gray-600">{{ $message }}</p>
        </div>

        <!-- Thông tin chi tiết -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div class="flex items-start">
                <i class="fas fa-info-circle text-green-600 mt-1 mr-3"></i>
                <div>
                    <h3 class="font-semibold text-green-800 mb-1">Tài khoản của bạn đã được kích hoạt</h3>
                    <p class="text-sm text-green-700">
                        Bây giờ bạn có thể đăng nhập và sử dụng tất cả các tính năng của hệ thống.
                    </p>
                </div>
            </div>
        </div>

        <!-- Các bước tiếp theo -->
        <div class="space-y-3 mb-6">
            <h3 class="font-semibold text-gray-900 mb-3">Bước tiếp theo:</h3>
            <div class="flex items-center text-sm text-gray-600">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <span>Đăng nhập vào tài khoản của bạn</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold text-xs">2</span>
                </div>
                <span>Khám phá các sản phẩm nội thất</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-semibold text-xs">3</span>
                </div>
                <span>Thực hiện đơn hàng đầu tiên</span>
            </div>
        </div>

        <!-- Nút hành động -->
        <div class="space-y-3">
            <a href="/login" 
               class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Đăng nhập ngay
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
                Cảm ơn bạn đã chọn NextGen!
            </p>
        </div>
    </div>

    <!-- Auto redirect script -->
    <script>
        // Tự động chuyển hướng sau 10 giây
        setTimeout(function() {
            window.location.href = '/login';
        }, 10000);

        // Hiển thị countdown
        let countdown = 10;
        const countdownElement = document.createElement('div');
        countdownElement.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm';
        countdownElement.innerHTML = `Tự động chuyển hướng sau <span id="countdown">${countdown}</span> giây`;
        document.body.appendChild(countdownElement);

        const countdownInterval = setInterval(function() {
            countdown--;
            document.getElementById('countdown').textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownElement.remove();
            }
        }, 1000);
    </script>
</body>
</html> 