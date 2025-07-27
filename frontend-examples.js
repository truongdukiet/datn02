// Frontend API Integration Examples
// Sử dụng cho React, Vue, Angular hoặc vanilla JavaScript

// ========================================
// CONFIGURATION
// ========================================
const API_BASE_URL = 'http://localhost:8000/api';

// Cấu hình cho frontend chạy trên port 5137
// Backend: http://localhost:8000
// Frontend: http://localhost:5137

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Hàm tạo headers cho API calls
const getHeaders = (includeAuth = false) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// Hàm xử lý response
const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
    }
    
    return data;
};

// ========================================
// AUTHENTICATION APIs
// ========================================

// Đăng ký tài khoản
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

// Đăng nhập
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await handleResponse(response);
        
        // Lưu token nếu có
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Đăng xuất
export const logout = () => {
    localStorage.removeItem('auth_token');
    // Có thể gọi API logout nếu cần
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (email, password, password_confirmation, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
                password_confirmation,
                token
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

// ========================================
// PRODUCT APIs
// ========================================

// Lấy danh sách sản phẩm
export const getProducts = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;
        
        const response = await fetch(url, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get products error:', error);
        throw error;
    }
};

// Tìm kiếm sản phẩm
export const searchProducts = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Search products error:', error);
        throw error;
    }
};

// Chi tiết sản phẩm
export const getProductDetail = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/detail/${id}`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get product detail error:', error);
        throw error;
    }
};

// ========================================
// CATEGORY APIs
// ========================================

// Lấy danh sách danh mục
export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get categories error:', error);
        throw error;
    }
};

// Chi tiết danh mục
export const getCategoryDetail = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get category detail error:', error);
        throw error;
    }
};

// ========================================
// CART APIs
// ========================================

// Xem giỏ hàng
export const getCart = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts`, {
            headers: getHeaders(true), // Cần authentication
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get cart error:', error);
        throw error;
    }
};

// Thêm vào giỏ hàng
export const addToCart = async (productId, quantity, variantId = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts`, {
            method: 'POST',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
                variant_id: variantId
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Add to cart error:', error);
        throw error;
    }
};

// Cập nhật giỏ hàng
export const updateCartItem = async (cartId, quantity) => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts`, {
            method: 'PUT',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                cart_id: cartId,
                quantity: quantity
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Update cart error:', error);
        throw error;
    }
};

// Xóa item khỏi giỏ hàng
export const removeFromCart = async (cartId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts/item`, {
            method: 'DELETE',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                cart_id: cartId
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Remove from cart error:', error);
        throw error;
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts`, {
            method: 'DELETE',
            headers: getHeaders(true),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Clear cart error:', error);
        throw error;
    }
};

// ========================================
// ORDER APIs
// ========================================

// Lấy danh sách đơn hàng
export const getOrders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: getHeaders(true),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get orders error:', error);
        throw error;
    }
};

// Chi tiết đơn hàng
export const getOrderDetail = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            headers: getHeaders(true),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get order detail error:', error);
        throw error;
    }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify(orderData)
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Create order error:', error);
        throw error;
    }
};

// ========================================
// REVIEW APIs
// ========================================

// Lấy đánh giá sản phẩm
export const getProductReviews = async (productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews?product_id=${productId}`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get reviews error:', error);
        throw error;
    }
};

// Thêm đánh giá
export const addReview = async (productId, rating, comment) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                product_id: productId,
                rating: rating,
                comment: comment
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Add review error:', error);
        throw error;
    }
};

// ========================================
// FAVORITE PRODUCT APIs
// ========================================

// Lấy danh sách yêu thích
export const getFavoriteProducts = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorite-products/${userId}`, {
            headers: getHeaders(true),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get favorites error:', error);
        throw error;
    }
};

// Thêm vào yêu thích
export const addToFavorites = async (userId, productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorite-products`, {
            method: 'POST',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                user_id: userId,
                product_id: productId
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Add to favorites error:', error);
        throw error;
    }
};

// Xóa khỏi yêu thích
export const removeFromFavorites = async (userId, productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorite-products`, {
            method: 'DELETE',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                user_id: userId,
                product_id: productId
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Remove from favorites error:', error);
        throw error;
    }
};

// ========================================
// NEWS APIs
// ========================================

// Lấy danh sách tin tức
export const getNews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/news`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get news error:', error);
        throw error;
    }
};

// Chi tiết tin tức
export const getNewsDetail = async (slug) => {
    try {
        const response = await fetch(`${API_BASE_URL}/news/${slug}`, {
            headers: getHeaders(),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get news detail error:', error);
        throw error;
    }
};

// ========================================
// USER APIs
// ========================================

// Lấy thông tin user hiện tại
export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            headers: getHeaders(true),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

// Cập nhật thông tin user
export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

// ========================================
// USAGE EXAMPLES
// ========================================

// Ví dụ sử dụng trong React component
/*
import React, { useState, useEffect } from 'react';
import { getProducts, addToCart, login } from './frontend-examples.js';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data.data || []);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            alert('Đã thêm vào giỏ hàng!');
        } catch (error) {
            alert('Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                    <button onClick={() => handleAddToCart(product.id)}>
                        Thêm vào giỏ hàng
                    </button>
                </div>
            ))}
        </div>
    );
}
*/

// Ví dụ sử dụng trong Vue component
/*
<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }}</p>
      <button @click="addToCart(product.id)">Thêm vào giỏ hàng</button>
    </div>
  </div>
</template>

<script>
import { getProducts, addToCart } from './frontend-examples.js';

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
  },
  methods: {
    async addToCart(productId) {
      try {
        await addToCart(productId, 1);
        alert('Đã thêm vào giỏ hàng!');
      } catch (error) {
        alert('Lỗi khi thêm vào giỏ hàng');
      }
    }
  }
}
</script>
*/ 