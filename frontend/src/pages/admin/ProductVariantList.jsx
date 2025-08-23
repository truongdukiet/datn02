// ProductVariantList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductVariantForm from './ProductVariantForm';
import { useNavigate, useParams } from 'react-router-dom';

const ProductVariantList = () => {
    const [variants, setVariants] = useState([]);
    const [variantAttributes, setVariantAttributes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editVariant, setEditVariant] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [productName, setProductName] = useState("");
    
    const { productId } = useParams();
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
            const variantsData = response.data.data || [];
            setVariants(variantsData);
            
            // Fetch attributes cho từng variant
            fetchAllVariantAttributes(variantsData);
        } catch (err) {
            setError("Error fetching product variants");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllVariantAttributes = async (variantsData) => {
        try {
            const attributesMap = {};
            
            const attributePromises = variantsData.map(async (variant) => {
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/variant-attributes?variant_id=${variant.ProductVariantID}`
                    );
                    
                    // Lọc chỉ lấy attributes có ProductVariantID trùng với variant hiện tại
                    const filteredAttributes = (response.data.data || []).filter(
                        attr => attr.ProductVariantID === variant.ProductVariantID
                    );
                    
                    attributesMap[variant.ProductVariantID] = filteredAttributes;
                } catch (error) {
                    console.error(`Error fetching attributes for variant ${variant.ProductVariantID}:`, error);
                    attributesMap[variant.ProductVariantID] = [];
                }
            });
            
            await Promise.all(attributePromises);
            setVariantAttributes(attributesMap);
        } catch (error) {
            console.error('Error fetching variant attributes:', error);
        }
    };


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
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditVariant(null);
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setEditVariant(null);
        fetchProducts();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditVariant(null);
    };

     const renderAttributes = (variantId) => {
        const attributes = variantAttributes[variantId] || [];
        if (!attributes.length) return null;
        
        return (
            <div className="attribute-tags">
                {attributes.map((attr, index) => (
                    <span key={index} className="attribute-tag">
                        {attr.name}: {attr.value}
                    </span>
                ))}
            </div>
        );
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="product-variant-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>
                    {productId ? `Biến thể sản phẩm: ${productName}` : 'Quản lý biến thể sản phẩm'}
                </h1>
                <div>
                    {productId && (
                        <button 
                            onClick={() => navigate('/admin/products')}
                            className="btn btn-secondary"
                            style={{ marginRight: '10px' }}
                        >
                            Quay lại
                        </button>
                    )}
                    <button 
                        onClick={handleAddNew}
                        className="btn btn-primary"
                    >
                        Thêm biến thể mới
                    </button>
                </div>
            </div>
            
            {showForm && (
                <div className="form-container" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <ProductVariantForm 
                        variant={editVariant} 
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancel}
                        productId={productId}
                    />
                </div>
            )}
            
            <table className="variant-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        {!productId && <th>ProductID</th>}
                        <th>Image</th>
                        <th>SKU</th>
                        <th>Giá</th>
                        <th>Thuộc tính</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {variants.length > 0 ? (
                        variants.map((variant) => (
                            <tr key={variant.ProductVariantID}>
                                <td>{variant.ProductVariantID}</td>
                                {!productId && <td>{variant.ProductID}</td>}
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
                                <td>{variant.Price.toLocaleString()}đ</td>
                                <td>
                                    {renderAttributes(variant.ProductVariantID)}
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-edit"
                                        onClick={() => handleEdit(variant)}
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-delete"
                                        onClick={() => handleDelete(variant.ProductVariantID)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={productId ? "6" : "7"} className="no-variants">
                                Không có biến thể nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <style jsx>{`
                .attribute-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                
                .attribute-tag {
                    background-color: #e9ecef;
                    color: #495057;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                }
                
                .product-image {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                
                .no-image {
                    color: #6c757d;
                    font-style: italic;
                }
                
                .btn {
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    border: none;
                    margin-right: 5px;
                }
                
                .btn-primary {
                    background-color: #007bff;
                    color: white;
                }
                
                .btn-secondary {
                    background-color: #6c757d;
                    color: white;
                }
                
                .btn-sm {
                    padding: 5px 10px;
                    font-size: 12px;
                }
                
                .btn-edit {
                    background-color: #ffc107;
                    color: #212529;
                }
                
                .btn-delete {
                    background-color: #dc3545;
                    color: white;
                }
                
                .variant-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                
                .variant-table th, .variant-table td {
                    border: 1px solid #dee2e6;
                    padding: 8px;
                    text-align: left;
                }
                
                .variant-table th {
                    background-color: #f8f9fa;
                }
                
                .no-variants {
                    text-align: center;
                    color: #6c757d;
                    padding: 20px;
                }
                
                .form-container {
                    background-color: #f8f9fa;
                }
                
                .loading {
                    text-align: center;
                    padding: 20px;
                    font-size: 18px;
                }
                
                .error {
                    color: #dc3545;
                    text-align: center;
                    padding: 20px;
                }
            `}</style>
        </div>
    );
};

export default ProductVariantList;