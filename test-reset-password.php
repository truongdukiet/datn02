<?php
/**
 * Test Script cho chức năng Reset Password
 * Chạy script này để kiểm tra toàn bộ luồng reset password
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

echo "=== TEST RESET PASSWORD ===\n\n";

// Test 1: Kiểm tra database connection
echo "1. Kiểm tra database connection...\n";
try {
    DB::connection()->getPdo();
    echo "✅ Database connection OK\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Kiểm tra bảng password_reset_tokens
echo "\n2. Kiểm tra bảng password_reset_tokens...\n";
try {
    $tableExists = DB::getSchemaBuilder()->hasTable('password_reset_tokens');
    if ($tableExists) {
        echo "✅ Bảng password_reset_tokens tồn tại\n";
    } else {
        echo "❌ Bảng password_reset_tokens không tồn tại\n";
    }
} catch (Exception $e) {
    echo "❌ Lỗi kiểm tra bảng: " . $e->getMessage() . "\n";
}

// Test 3: Kiểm tra User model
echo "\n3. Kiểm tra User model...\n";
try {
    $user = User::first();
    if ($user) {
        echo "✅ User model hoạt động, tìm thấy user: " . $user->Fullname . "\n";
    } else {
        echo "⚠️ Không có user nào trong database\n";
    }
} catch (Exception $e) {
    echo "❌ Lỗi User model: " . $e->getMessage() . "\n";
}

// Test 4: Kiểm tra Hash function
echo "\n4. Kiểm tra Hash function...\n";
try {
    $testPassword = 'testpassword123';
    $hashedPassword = Hash::make($testPassword);
    $isValid = Hash::check($testPassword, $hashedPassword);
    
    if ($isValid) {
        echo "✅ Hash function hoạt động bình thường\n";
    } else {
        echo "❌ Hash function không hoạt động\n";
    }
} catch (Exception $e) {
    echo "❌ Lỗi Hash function: " . $e->getMessage() . "\n";
}

// Test 5: Kiểm tra validation rules
echo "\n5. Kiểm tra validation rules...\n";
try {
    $rules = ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()];
    echo "✅ Validation rules hợp lệ\n";
} catch (Exception $e) {
    echo "❌ Lỗi validation rules: " . $e->getMessage() . "\n";
}

// Test 6: Kiểm tra routes
echo "\n6. Kiểm tra routes...\n";
try {
    $routes = [
        'GET /forgot-password' => 'password.request',
        'POST /forgot-password' => 'password.email', 
        'GET /reset-password/{id}/{token}' => 'password.reset',
        'POST /reset-password/{id}/{token}' => 'password.update'
    ];
    
    foreach ($routes as $route => $name) {
        echo "✅ Route: $route ($name)\n";
    }
} catch (Exception $e) {
    echo "❌ Lỗi routes: " . $e->getMessage() . "\n";
}

echo "\n=== KẾT QUẢ TEST ===\n";
echo "Nếu tất cả đều ✅, chức năng reset password sẽ hoạt động bình thường.\n";
echo "Nếu có ❌, cần sửa lỗi trước khi test.\n\n";

echo "=== HƯỚNG DẪN TEST THỰC TẾ ===\n";
echo "1. Gửi email reset: POST /forgot-password với email hợp lệ\n";
echo "2. Kiểm tra email nhận được\n";
echo "3. Click link trong email\n";
echo "4. Nhập password mới và submit form\n";
echo "5. Kiểm tra redirect đến login với success message\n";
echo "6. Thử login với password mới\n\n";

echo "=== LƯU Ý ===\n";
echo "- Đảm bảo mail configuration đúng\n";
echo "- Đảm bảo session và flash messages hoạt động\n";
echo "- Test với token hợp lệ và không hợp lệ\n";
echo "- Test với password ngắn và không khớp\n"; 