import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../public/css/ProductVariantForm.css'; // Tạo file CSS riêng

const ProductVariantForm = ({ variant, onSubmit, productId }) => {
    const [formData, setFormData] = useState({
        ProductID: productId || '',
        Sku: '',
        Price: '',
        Stock: '',
        Image: null
    });
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [imagePreview, setImagePreview] = useState(null); // Thêm state cho ảnh preview
    
    const API_BASE_URL = 'http://localhost:8000/api';

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/attributes`);
                setAttributes(response.data.data || []);
            } catch (error) {
                console.error('Error fetching attributes:', error);
            }
        };
        
        fetchAttributes();
        
        if (variant) {
            setFormData({
                ProductID: variant.ProductID,
                Sku: variant.Sku,
                Price: variant.Price,
                Stock: variant.Stock,
                Image: null
            });
            
            // Nếu variant có ảnh, hiển thị preview
            if (variant.Image) {
                setImagePreview(`http://localhost:8000/storage/${variant.Image}`);
            }
            
            const fetchVariantAttributes = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/variant-attributes?variant_id=${variant.ProductVariantID}`);
                    const attrs = {};
                    response.data.data.forEach(attr => {
                        attrs[attr.AttributeID] = attr.value;
                    });
                    setSelectedAttributes(attrs);
                } catch (error) {
                    console.error('Error fetching variant attributes:', error);
                }
            };
            
            fetchVariantAttributes();
        }
    }, [variant, productId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, Image: file });
        
        // Tạo URL cho ảnh preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleAttributeChange = (attributeId, value) => {
        setSelectedAttributes({
            ...selectedAttributes,
            [attributeId]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        formDataToSend.append('ProductID', formData.ProductID);
        formDataToSend.append('Sku', formData.Sku);
        formDataToSend.append('Price', formData.Price);
        formDataToSend.append('Stock', formData.Stock);
        
        if (formData.Image) {
            formDataToSend.append('Image', formData.Image);
        }

        Object.keys(selectedAttributes).forEach(attrId => {
            formDataToSend.append(`attributes[${attrId}]`, selectedAttributes[attrId]);
        });

        try {
            if (variant) {
                await axios.put(
                    `${API_BASE_URL}/product-variants/${variant.ProductVariantID}`,
                    formDataToSend,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            } else {
                await axios.post(
                    `${API_BASE_URL}/product-variants`,
                    formDataToSend,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            }
            alert('Lưu biến thể thành công!');
            onSubmit();
        } catch (error) {
            console.error('Lỗi khi lưu biến thể:', {
                message: error.message,
                response: error.response?.data
            });
            
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert(`Lỗi:\n${errorMessages}`);
            } else {
                alert('Lỗi khi lưu biến thể: ' + (error.response?.data.message || error.message));
            }
        }
    };

    return (
        <div className="variant-form">
            <h2>{variant ? "Sửa biến thể" : "Thêm biến thể mới"}</h2>
            <form onSubmit={handleSubmit} className="variant-form-container">
                <div className="form-columns">
                    <div className="form-column">
                        {!productId && (
                            <div className="form-group">
                                <label>Product ID:</label>
                                <input
                                    type="number"
                                    name="ProductID"
                                    value={formData.ProductID}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>SKU:</label>
                            <input
                                type="text"
                                name="Sku"
                                value={formData.Sku}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Giá:</label>
                            <input
                                type="number"
                                name="Price"
                                value={formData.Price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Tồn kho:</label>
                            <input
                                type="number"
                                name="Stock"
                                value={formData.Stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-column">
                        <div className="form-group">
                            <label>Hình ảnh:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {imagePreview && (
                                <div className="image-preview-container">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="image-preview"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="attributes-section">
                    <h3>Thuộc tính:</h3>
                    <div className="attributes-grid">
                        {attributes.map(attr => (
                            <div key={attr.AttributeID} className="attribute-item">
                                <label>{attr.name}:</label>
                                <input
                                    type="text"
                                    value={selectedAttributes[attr.AttributeID] || ''}
                                    onChange={(e) => handleAttributeChange(attr.AttributeID, e.target.value)}
                                    placeholder={`Nhập ${attr.name}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {variant ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductVariantForm;