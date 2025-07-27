# Test Luồng Reset Password

## 🔍 **Kiểm tra code hiện tại:**

### **1. View reset-password.blade.php:**
✅ **Form action đúng:** `{{ route('password.reset', ['id' => $user->UserID, 'token' => $token]) }}`
✅ **Method POST:** `<form method="POST"`
✅ **CSRF token:** `@csrf`
✅ **Password fields:** `password` và `password_confirmation`
✅ **Validation:** `required`, `min:6`

### **2. PasswordResetWebController.php:**
✅ **Method resetPassword:** Xử lý POST request
✅ **Validation:** `['required', 'confirmed', 'min:6']`
✅ **Token validation:** Kiểm tra token trong database
✅ **Token expiry:** Kiểm tra 60 phút
✅ **Password update:** `Hash::make($request->password)`
✅ **Token cleanup:** Xóa token sau khi dùng
✅ **Redirect:** Chuyển đến login với success message

### **3. Routes web.php:**
✅ **GET route:** `/reset-password/{id}/{token}` → `showResetPasswordForm`
✅ **POST route:** `/reset-password/{id}/{token}` → `resetPassword`
✅ **Route names:** `password.reset` và `password.update`

## 🧪 **Test Cases:**

### **Test Case 1: Token hợp lệ**
1. Gửi email reset password
2. Click link trong email
3. Nhập password mới: `newpassword123`
4. Xác nhận password: `newpassword123`
5. Submit form
6. **Expected:** Redirect đến login với message "Đặt lại mật khẩu thành công!"

### **Test Case 2: Token hết hạn**
1. Tạo token cũ (>60 phút)
2. Truy cập link reset
3. **Expected:** Redirect đến forgot-password với error "Liên kết đã hết hạn"

### **Test Case 3: Token không hợp lệ**
1. Truy cập link với token sai
2. **Expected:** Redirect đến forgot-password với error "Liên kết không hợp lệ"

### **Test Case 4: Password không khớp**
1. Nhập password: `password123`
2. Xác nhận password: `password456`
3. Submit form
4. **Expected:** Validation error "The password confirmation does not match"

### **Test Case 5: Password quá ngắn**
1. Nhập password: `123`
2. Submit form
3. **Expected:** Validation error "The password must be at least 6 characters"

## 🔧 **Các điểm cần lưu ý:**

### **✅ Điểm mạnh:**
- Code logic đúng và đầy đủ
- Validation chặt chẽ
- Bảo mật tốt (token expiry, cleanup)
- User experience tốt (clear messages)

### **⚠️ Cần kiểm tra:**
1. **Database connection:** Đảm bảo bảng `password_reset_tokens` tồn tại
2. **Mail configuration:** Đảm bảo email được gửi thành công
3. **Hash function:** Đảm bảo `Hash::make()` hoạt động đúng
4. **Session messages:** Đảm bảo flash messages hiển thị đúng

## 🚀 **Cách test thực tế:**

### **Bước 1: Test gửi email**
```bash
POST /forgot-password
{
    "email": "test@example.com"
}
```

### **Bước 2: Kiểm tra email**
- Mở email nhận được
- Copy link reset password

### **Bước 3: Test reset form**
- Mở link trong browser
- Nhập password mới
- Submit form

### **Bước 4: Verify kết quả**
- Kiểm tra database: password đã được update
- Kiểm tra token đã được xóa
- Thử login với password mới

## 📝 **Kết luận:**

Code reset password **CÓ THỂ** hoạt động thành công nếu:
1. Database connection ổn định
2. Mail configuration đúng
3. Routes được load đúng
4. Không có lỗi syntax

**Khuyến nghị:** Test thực tế để xác nhận! 