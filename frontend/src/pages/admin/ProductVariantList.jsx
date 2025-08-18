// ProductVariantList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductVariantForm from './ProductVariantForm';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams

const ProductVariantList = () => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editVariant, setEditVariant] = useState(null);
    const [productName, setProductName] = useState(""); // Tên sản phẩm
    
    const { productId } = useParams(); // Lấy productId từ URL
    const API_BASE_URL = 'http://localhost:8000/api';
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        if (productId) {
            fetchProductName();
        }
    }, [productId]);

    const fetchProducts = async () => {
        try {
            let url = `${API_BASE_URL}/product-variants`;
            if (productId) {
                url += `?product_id=${productId}`;
            }
            
            const response = await axios.get(url);
            setVariants(response.data.data || []);
        } catch (err) {
            setError("Error fetching product variants");
        } finally {
            setLoading(false);
        }
    };

    // Lấy tên sản phẩm nếu có productId
    const fetchProductName = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
            setProductName(response.data.data?.Name || "");
        } catch (error) {
            console.error('Error fetching product name:', error);
        }
    };

    const handleDelete = async (ProductVariantID) => {
        try {
            await axios.delete(`${API_BASE_URL}/product-variants/${ProductVariantID}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting variant:', error);
        }
    };

    const handleEdit = (variant) => {
        setEditVariant(variant);
    };

    const handleFormSubmit = () => {
        setEditVariant(null);
        fetchProducts();
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

   if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="product-variant-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>
                    {productId ? `Biến thể sản phẩm: ${productName}` : 'Quản lý sản phẩm'}
                </h1>
                {productId && (
                    <button 
                        onClick={() => navigate('/admin/products')}
                        style={{ padding: '8px 16px', background: '#6c757d', color: 'white' }}
                    >
                        Quay lại
                    </button>
                )}
            </div>
            
            <ProductVariantForm 
                variant={editVariant} 
                onSubmit={handleFormSubmit} 
                productId={productId} // Truyền productId cho form
            />
            <table className="variant-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ProductID</th>
                        <th>Image</th>
                        <th>SKU</th>
                        <th>Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {variants.length > 0 ? (
                        variants.map((variant) => (
                            <tr key={variant.ProductVariantID}>
                                <td>{variant.ProductVariantID}</td>
                                <td>{variant.ProductID}</td>
                                <td>
                                    {variant.Image ? (
                                        <img
                                            src={`http://localhost:8000/storage/${variant.Image}`}
                                            alt="Product"
                                            className="product-image"
                                        />
                                    ) : (
                                        <span className="no-image">No Image</span>
                                    )}
                                </td>
                                <td>{variant.Sku}</td>
                                <td>${variant.Price}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEdit(variant)}>Sửa</button>
                                    <button className="delete-button" onClick={() => handleDelete(variant.ProductVariantID)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-variants">Không có sản phẩm nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductVariantList;
