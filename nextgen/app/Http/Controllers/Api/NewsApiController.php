<?php
// Bật CORS (Cross-Origin Resource Sharing) để React có thể truy cập
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Hoặc domain của ReactJS của bạn, ví dụ: 'http://localhost:3000'
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS'); // Cho phép các phương thức cần thiết
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Xử lý yêu cầu OPTIONS (preflight request của CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- THAY THẾ THÔNG TIN KẾT NỐI DATABASE CỦA BẠN TẠI ĐÂY ---
$servername = "localhost"; // Hoặc địa chỉ host database của bạn
$username = "root";        // Tên người dùng database
$password = "";            // Mật khẩu database
$dbname = "your_database_name"; // Tên database của bạn (ví dụ: 'admin_dashboard')

// Kết nối đến cơ sở dữ liệu MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    echo json_encode(["message" => "Lỗi kết nối database: " . $conn->connect_error]);
    exit(); // Dừng thực thi nếu có lỗi kết nối
}
// --- KẾT THÚC THÔNG TIN KẾT NỐI DATABASE ---

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        handleGetArticles($conn);
        break;
    case 'PUT':
        handlePutArticle($conn); // Dùng PUT cho cập nhật
        break;
    case 'POST':
        handlePostArticle($conn); // Dùng POST cho thêm mới
        break;
    // Bạn có thể thêm các case khác cho DELETE nếu cần
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(["message" => "Phương thức không được hỗ trợ."]);
        break;
}

$conn->close(); // Đóng kết nối database

// --- CÁC HÀM XỬ LÝ API ---

function handleGetArticles($conn) {
    $sql = "SELECT id, title, publishDate, author, statusText, statusClass FROM articles ORDER BY id DESC";
    $result = $conn->query($sql);

    $articles = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $articles[] = $row;
        }
    }
    echo json_encode($articles); // Trả về mảng JSON
}

function handlePutArticle($conn) {
    // Đọc dữ liệu JSON từ request body
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    $statusText = $data['statusText'] ?? null;
    $statusClass = $data['statusClass'] ?? null;
    // Bạn có thể thêm các trường khác nếu muốn cập nhật đầy đủ hơn

    if ($id === null || $statusText === null || $statusClass === null) {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Dữ liệu không hợp lệ để cập nhật trạng thái."]);
        return;
    }

    $stmt = $conn->prepare("UPDATE articles SET statusText = ?, statusClass = ? WHERE id = ?");
    $stmt->bind_param("ssi", $statusText, $statusClass, $id); // s: string, i: integer

    if ($stmt->execute()) {
        echo json_encode(["message" => "Cập nhật trạng thái bài viết thành công."]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Lỗi khi cập nhật trạng thái bài viết: " . $stmt->error]);
    }
    $stmt->close();
}

function handlePostArticle($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    $title = $data['title'] ?? null;
    $publishDate = $data['publishDate'] ?? null;
    $author = $data['author'] ?? null;
    $statusText = $data['statusText'] ?? 'Bản nháp'; // Mặc định là bản nháp
    $statusClass = $data['statusClass'] ?? 'draft'; // Mặc định là bản nháp

    if ($title === null || $publishDate === null || $author === null) {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Thiếu thông tin cần thiết để thêm bài viết."]);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO articles (title, publishDate, author, statusText, statusClass) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $title, $publishDate, $author, $statusText, $statusClass);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Thêm bài viết mới thành công.", "id" => $conn->insert_id]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Lỗi khi thêm bài viết mới: " . $stmt->error]);
    }
    $stmt->close();
}

?>
