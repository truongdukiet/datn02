<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization");

// ✅ Kết nối database
$host = "localhost";
$db_name = "datn"; // Đổi tên DB
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Kết nối DB thất bại: " . $e->getMessage()]);
    exit;
}

// ✅ Lấy dữ liệu từ React
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Kiểm tra dữ liệu bắt buộc
if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu thông tin email"]);
    exit;
}

// ✅ Lấy thông tin từ request
$fullname = $data['name'] ?? '';
$email = $data['email'];
$phone = $data['phone'] ?? '';
$address = $data['address'] ?? '';

try {
    // ✅ Kiểm tra email tồn tại
    $checkStmt = $pdo->prepare("SELECT UserID FROM users WHERE Email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->rowCount() === 0) {
        echo json_encode(["success" => false, "message" => "Email không tồn tại"]);
        exit;
    }

    // ✅ Cập nhật thông tin
    $stmt = $pdo->prepare("UPDATE users SET Fullname = ?, Phone = ?, Address = ?, Updated_at = NOW() WHERE Email = ?");
    $stmt->execute([$fullname, $phone, $address, $email]);

    echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi: " . $e->getMessage()]);
}
