<?php
// Cho phép các domain khác truy cập (để React có thể gọi API)
// Bạn nên thay đổi "*" thành domain của frontend khi deploy thật
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Dữ liệu dashboard
// Bạn có thể thay thế phần này bằng dữ liệu thật từ database của bạn
$response = [
    "status" => "success",
    "data" => [
        "totalUsers" => 1250,
        "totalOrders" => 42,
        "totalRevenue" => 55000000,
        "newProducts" => 10,
    ]
];

// Trả về dữ liệu dưới dạng JSON
echo json_encode($response);
?>
