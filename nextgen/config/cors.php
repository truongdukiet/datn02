<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Cấu hình này cho phép API của bạn nhận yêu cầu từ các domain khác.
    | Điều này đặc biệt quan trọng khi frontend và backend chạy khác cổng.
    |
    */

    // ✅ Áp dụng cho tất cả endpoint trong API + route cần thiết
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'payment-gateways', '*'],

    // ✅ Cho phép tất cả HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
    'allowed_methods' => ['*'],

    // ✅ Danh sách domain được phép truy cập API (không dùng '*', vì supports_credentials = true)
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'), // React (Vite)
        'http://127.0.0.1:5173', // Localhost IP
        'http://localhost:3000', // Next.js hoặc React (CRA)
        'https://your-production-domain.com' // Domain production thật
    ],

    // ✅ Không cần pattern bổ sung
    'allowed_origins_patterns' => [],

    // ✅ Cho phép tất cả headers để không bị lỗi khi gửi Authorization hoặc X-Requested-With
    'allowed_headers' => ['*'],

    // ✅ Không expose headers nào đặc biệt
    'exposed_headers' => [],

    // ✅ Thời gian cache của preflight request (OPTIONS) = 1 ngày
    'max_age' => 86400,

    // ✅ Cho phép gửi cookie + Authorization token
    'supports_credentials' => true,
];
