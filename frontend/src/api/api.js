// Frontend API Integration for React
// Kết nối với Laravel Backend

// ========================================
// CONFIGURATION
// ========================================
const API_BASE_URL = 'http://localhost:8000/api';

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
        const error = new Error(data.message || 'Có lỗi xảy ra');
        if (data.errors) error.errors = data.errors; // Gắn errors vào object error
        throw error;
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
export const login = async (login, Password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ login, Password })
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
export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts`, {
            method: 'POST',
            headers: getHeaders(true),
            credentials: 'include',
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Add to cart error:', error);
        throw error;
    }
};

// Xóa khỏi giỏ hàng
export const removeFromCart = async (cartId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
            method: 'DELETE',
            headers: getHeaders(true),
            credentials: 'include'
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Remove from cart error:', error);
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