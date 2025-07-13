# 🛍️ E-Commerce React App

Ứng dụng E-Commerce được xây dựng với React frontend và Laravel backend.

## 🚀 Cách chạy dự án

### Bước 1: Khởi động Laravel Backend

```bash
# Di chuyển vào thư mục Laravel
cd ../nextgen

# Cài đặt dependencies (nếu chưa có)
composer install

# Tạo file .env từ .env.example
cp .env.example .env

# Tạo key ứng dụng
php artisan key:generate

# Cấu hình database trong file .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database_name
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Chạy migrations
php artisan migrate

# Thêm vào file .env
FRONTEND_URL=http://localhost:3000

# Clear cache
php artisan config:clear
php artisan cache:clear

# Khởi động server Laravel
php artisan serve
```

Backend sẽ chạy tại: `http://localhost:8000`

### Bước 2: Khởi động React Frontend

```bash
# Di chuyển vào thư mục React
cd frontend

# Cài đặt dependencies
npm install

# Khởi động development server
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── components/
│   │   ├── ProductList.js      # Hiển thị danh sách sản phẩm
│   │   ├── ProductList.css
│   │   ├── Login.js           # Form đăng nhập
│   │   └── Login.css
│   ├── api.js                 # API integration
│   ├── App.js                 # Component chính
│   ├── App.css
│   └── index.js
└── package.json
```

## 🔧 Tính năng

- ✅ Đăng nhập/Đăng xuất
- ✅ Hiển thị danh sách sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Responsive design
- ✅ Kết nối API với Laravel backend

## 🎨 Giao diện

- Thiết kế hiện đại với gradient colors
- Responsive cho mobile và desktop
- Loading states và error handling
- Smooth animations và transitions

## 🔗 API Endpoints

- `POST /api/login` - Đăng nhập
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/carts` - Thêm vào giỏ hàng
- `GET /api/carts` - Xem giỏ hàng

## 🛣️ Đường dẫn (Routes)

- `/` - Trang chủ (tự động redirect)
- `/login` - Trang đăng nhập
- `/products` - Trang danh sách sản phẩm

## 🚨 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra:
1. `FRONTEND_URL` trong file `.env` đã đúng chưa
2. Đã clear cache chưa: `php artisan config:clear`
3. Server đã restart chưa

### Lỗi Database
Nếu gặp lỗi database:
1. Kiểm tra kết nối database trong `.env`
2. Chạy migrations: `php artisan migrate`
3. Kiểm tra MySQL service đã chạy chưa

### Lỗi React
Nếu gặp lỗi React:
1. Kiểm tra console browser
2. Kiểm tra Network tab để xem API calls
3. Đảm bảo backend đang chạy tại port 8000

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Console browser để xem lỗi JavaScript
2. Network tab để xem API calls
3. Laravel logs: `storage/logs/laravel.log`

## 🔗 Links hữu ích

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [API Documentation](../nextgen/API_DOCUMENTATION.md) 