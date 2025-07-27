# Hướng dẫn Setup Frontend với Laravel Backend

## 🚀 Bước 1: Cấu hình Backend

### 1.1 Cập nhật file .env
Thêm vào file `.env` của Laravel:
```env
FRONTEND_URL=http://localhost:5137
```

### 1.2 Clear cache
```bash
php artisan config:clear
php artisan cache:clear
```

### 1.3 Khởi động server
```bash
php artisan serve
```
Backend sẽ chạy tại: `http://localhost:8000`

## 🎯 Bước 2: Cấu hình Frontend

### 2.1 Cài đặt dependencies (nếu cần)
```bash
npm install axios
# hoặc
yarn add axios
```

### 2.2 Copy file API examples
Copy file `frontend-examples.js` vào project frontend của bạn.

### 2.3 Cập nhật API_BASE_URL
Trong file `frontend-examples.js`, cập nhật:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## 📋 Bước 3: Test kết nối

### 3.1 Test API cơ bản
```javascript
// Test lấy danh sách sản phẩm
fetch('http://localhost:8000/api/products')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 3.2 Test đăng ký/đăng nhập
```javascript
// Test đăng ký
fetch('http://localhost:8000/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    password_confirmation: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔧 Bước 4: Sử dụng trong Framework

### React
```jsx
import { getProducts, addToCart } from './frontend-examples.js';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Vue.js
```vue
<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }}</p>
    </div>
  </div>
</template>

<script>
import { getProducts } from './frontend-examples.js';

export default {
  data() {
    return {
      products: []
    }
  },
  async mounted() {
    try {
      const data = await getProducts();
      this.products = data.data || [];
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }
}
</script>
```

### Angular
```typescript
import { Component, OnInit } from '@angular/core';
import { getProducts } from './frontend-examples.js';

@Component({
  selector: 'app-products',
  template: `
    <div *ngFor="let product of products">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }}</p>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  async ngOnInit() {
    try {
      const data = await getProducts();
      this.products = data.data || [];
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }
}
```

## 🔐 Bước 5: Authentication

### 5.1 Đăng nhập
```javascript
import { login } from './frontend-examples.js';

const handleLogin = async (email, password) => {
  try {
    const data = await login(email, password);
    console.log('Login successful:', data);
    // Lưu token hoặc redirect
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 5.2 Bảo vệ routes
```javascript
// Kiểm tra authentication
const isAuthenticated = () => {
  return localStorage.getItem('auth_token') !== null;
};

// Redirect nếu chưa đăng nhập
if (!isAuthenticated()) {
  // Redirect to login page
}
```

## 🛒 Bước 6: Shopping Cart

### 6.1 Thêm vào giỏ hàng
```javascript
import { addToCart } from './frontend-examples.js';

const handleAddToCart = async (productId, quantity = 1) => {
  try {
    await addToCart(productId, quantity);
    alert('Đã thêm vào giỏ hàng!');
  } catch (error) {
    alert('Lỗi khi thêm vào giỏ hàng');
  }
};
```

### 6.2 Xem giỏ hàng
```javascript
import { getCart } from './frontend-examples.js';

const loadCart = async () => {
  try {
    const data = await getCart();
    console.log('Cart items:', data);
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
};
```

## 🚨 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra:
1. `FRONTEND_URL` trong file `.env` đã đúng chưa
2. Đã clear cache chưa: `php artisan config:clear`
3. Server đã restart chưa

### Lỗi Authentication
Nếu gặp lỗi authentication:
1. Kiểm tra token có được lưu đúng không
2. Kiểm tra headers có đúng format không
3. Kiểm tra `credentials: 'include'` đã được set chưa

### Lỗi Database
Nếu gặp lỗi database:
1. Kiểm tra kết nối database trong `.env`
2. Chạy migrations: `php artisan migrate`
3. Kiểm tra MySQL service đã chạy chưa

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Console browser để xem lỗi JavaScript
2. Network tab để xem API calls
3. Laravel logs: `storage/logs/laravel.log`

## 🔗 Links hữu ích

- [API Documentation](./API_DOCUMENTATION.md)
- [Frontend Examples](./frontend-examples.js)
- [Laravel Documentation](https://laravel.com/docs)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 