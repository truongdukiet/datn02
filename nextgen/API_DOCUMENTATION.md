# API Documentation - NextGen Laravel Backend

## Base URL
```
http://localhost:8000/api
```

## Authentication

### 1. Đăng ký tài khoản
```
POST /api/register
```
**Body:**
```json
{
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

### 2. Đăng nhập
```
POST /api/login
```
**Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### 3. Quên mật khẩu
```
POST /api/forgot-password
```
**Body:**
```json
{
    "email": "user@example.com"
}
```

### 4. Đặt lại mật khẩu
```
POST /api/reset-password
```
**Body:**
```json
{
    "email": "user@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123",
    "token": "reset_token_from_email"
}
```

## Products

### 1. Lấy danh sách sản phẩm
```
GET /api/products
```

### 2. Tìm kiếm sản phẩm
```
GET /api/products/search?q=keyword
```

### 3. Chi tiết sản phẩm
```
GET /api/products/detail/{id}
```

### 4. Thêm sản phẩm (Admin)
```
POST /api/products/add
```

### 5. Cập nhật sản phẩm (Admin)
```
PUT /api/products/update/{id}
```

### 6. Xóa sản phẩm (Admin)
```
DELETE /api/products/{id}
```

## Categories

### 1. Lấy danh sách danh mục
```
GET /api/categories
```

### 2. Chi tiết danh mục
```
GET /api/categories/{id}
```

### 3. Thêm danh mục (Admin)
```
POST /api/categories
```

### 4. Cập nhật danh mục (Admin)
```
PUT /api/categories/{id}
```

### 5. Xóa danh mục (Admin)
```
DELETE /api/categories/{id}
```

## Cart

### 1. Xem giỏ hàng
```
GET /api/carts
```

### 2. Thêm vào giỏ hàng
```
POST /api/carts
```
**Body:**
```json
{
    "product_id": 1,
    "quantity": 2,
    "variant_id": 1
}
```

### 3. Cập nhật giỏ hàng
```
PUT /api/carts
```
**Body:**
```json
{
    "cart_id": 1,
    "quantity": 3
}
```

### 4. Xóa item khỏi giỏ hàng
```
DELETE /api/carts/item
```
**Body:**
```json
{
    "cart_id": 1
}
```

### 5. Xóa toàn bộ giỏ hàng
```
DELETE /api/carts
```

## Orders

### 1. Lấy danh sách đơn hàng
```
GET /api/orders
```

### 2. Chi tiết đơn hàng
```
GET /api/orders/{id}
```

### 3. Tạo đơn hàng mới
```
POST /api/orders
```

## Users

### 1. Thông tin user hiện tại
```
GET /api/user
```
*Yêu cầu authentication*

### 2. Cập nhật thông tin user
```
PUT /api/users/{id}
```

## Reviews

### 1. Lấy đánh giá sản phẩm
```
GET /api/reviews?product_id={id}
```

### 2. Thêm đánh giá
```
POST /api/reviews
```
**Body:**
```json
{
    "product_id": 1,
    "rating": 5,
    "comment": "Sản phẩm rất tốt!"
}
```

## Favorite Products

### 1. Lấy danh sách yêu thích
```
GET /api/favorite-products/{userId}
```

### 2. Thêm vào yêu thích
```
POST /api/favorite-products
```
**Body:**
```json
{
    "user_id": 1,
    "product_id": 1
}
```

### 3. Xóa khỏi yêu thích
```
DELETE /api/favorite-products
```
**Body:**
```json
{
    "user_id": 1,
    "product_id": 1
}
```

## News

### 1. Lấy danh sách tin tức
```
GET /api/news
```

### 2. Chi tiết tin tức
```
GET /api/news/{slug}
```

## Vouchers

### 1. Lấy danh sách voucher
```
GET /api/vouchers
```

### 2. Chi tiết voucher
```
GET /api/vouchers/{id}
```

## Payment Gateways

### 1. Lấy danh sách cổng thanh toán
```
GET /api/payment-gateways
```

## Headers cần thiết

### Cho tất cả requests:
```
Accept: application/json
Content-Type: application/json
```

### Cho authenticated requests:
```
Authorization: Bearer {token}
```

## Error Responses

Tất cả API trả về lỗi với format:
```json
{
    "message": "Error message",
    "errors": {
        "field": ["Error description"]
    }
}
```

## Success Responses

Tất cả API thành công trả về:
```json
{
    "success": true,
    "data": {...},
    "message": "Success message"
}
```

## CORS Configuration

Backend đã được cấu hình CORS để chấp nhận requests từ:
- `http://localhost:5137` (React/Vue/Angular development)
- Domain frontend thực tế (cần cập nhật trong .env)

## Authentication Flow

1. User đăng ký/đăng nhập qua `/api/register` hoặc `/api/login`
2. Server trả về token hoặc session
3. Sử dụng token trong header `Authorization: Bearer {token}` cho các requests cần authentication
4. Hoặc sử dụng `withCredentials: true` để gửi cookies/session

## Ví dụ sử dụng với JavaScript

```javascript
// Base configuration
const API_BASE = 'http://localhost:8000/api';

// Đăng nhập
const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

// Lấy sản phẩm
const getProducts = async () => {
    const response = await fetch(`${API_BASE}/products`, {
        headers: {
            'Accept': 'application/json',
        },
        credentials: 'include'
    });
    return response.json();
};
``` 