<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php'; // Kết nối DB

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email'])) {
    $name = $data['name'];
    $email = $data['email'];
    $phone = $data['phone'];
    $address = $data['address'];

    // Giả sử user_id = 1 (hoặc lấy từ token)
    $sql = "UPDATE users SET name=?, email=?, phone=?, address=? WHERE id=1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $name, $email, $phone, $address);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Cập nhật thành công"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Cập nhật thất bại"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Dữ liệu không hợp lệ"]);
}
?>
