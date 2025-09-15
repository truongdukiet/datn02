import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../public/css/ProductVariantForm.css';

const ProductVariantForm = ({ variant, onSubmit, onCancel, productId }) => {
    const [formData, setFormData] = useState({
        ProductID: productId || '',
        Sku: '',
        Price: '',
        Stock: '',
        Image: null
    });
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
            
            if (variant.Image) {
                setCurrentImage(`http://localhost:8000/storage/${variant.Image}`);
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

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case "Sku":
                if (!value.trim()) {
                    error = "SKU không được để trống";
                } else if (!/^[A-Za-z0-9\-_]+$/.test(value)) {
                    error = "SKU chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới";
                }
                break;
            case "Price":
                if (!value) {
                    error = "Giá không được để trống";
                } else if (isNaN(value) || parseFloat(value) < 0) {
                    error = "Giá phải là số dương";
                } else if (!/^\d+$/.test(value)) {
                    error = "Giá phải là số tự nhiên";
                }
                break;
            case "Stock":
                if (!value && value !== 0) {
                    error = "Số lượng tồn kho không được để trống";
                } else if (isNaN(value) || parseInt(value) < 0) {
                    error = "Số lượng tồn kho phải là số nguyên dương";
                } else if (!/^\d+$/.test(value)) {
                    error = "Số lượng tồn kho phải là số tự nhiên";
                }
                break;
            case "ProductID":
                if (!value) {
                    error = "Product ID không được để trống";
                }
                break;
            default:
                break;
        }
        
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate field on change
        const error = validateField(name, value);
        setFieldErrors({ ...fieldErrors, [name]: error });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors({ ...fieldErrors, [name]: error });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
            setFieldErrors({ ...fieldErrors, Image: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG, JPG hoặc GIF' });
            e.target.value = '';
            return;
        }
        
        if (file.size > maxSize) {
            setFieldErrors({ ...fieldErrors, Image: 'Kích thước file không được vượt quá 5MB' });
            e.target.value = '';
            return;
        }
        
        setFormData({ ...formData, Image: file });
        setFieldErrors({ ...fieldErrors, Image: '' });
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAttributeChange = (attributeId, value) => {
        setSelectedAttributes({
            ...selectedAttributes,
            [attributeId]: value
        });
        
        // Validate attribute
        const error = !value.trim() ? "Giá trị thuộc tính không được để trống" : "";
        setFieldErrors({ 
            ...fieldErrors, 
            [`attribute_${attributeId}`]: error 
        });
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, Image: null });
        setImagePreview(null);
        setCurrentImage(null);
        setFieldErrors({ ...fieldErrors, Image: '' });
    };

    const validateForm = () => {
        const errors = {};
        
        // Validate all fields
        Object.keys(formData).forEach(key => {
            if (key !== 'Image') { // Skip image for general validation
                const error = validateField(key, formData[key]);
                if (error) errors[key] = error;
            }
        });
        
        // Validate attributes
        attributes.forEach(attr => {
            const attrValue = selectedAttributes[attr.AttributeID] || '';
            if (!attrValue.trim()) {
                errors[`attribute_${attr.AttributeID}`] = "Giá trị thuộc tính không được để trống";
            }
        });
        
        // Validate image for new variant
        if (!variant && !formData.Image && !currentImage) {
            errors.Image = 'Vui lòng chọn ảnh cho biến thể sản phẩm';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstErrorField = Object.keys(fieldErrors)[0];
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                               document.querySelector(`[data-attribute="${firstErrorField}"]`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            if (variant) {
                // Xử lý update - dùng FormData để hỗ trợ cả ảnh
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

                await axios.post(
                    `${API_BASE_URL}/product-variants/${variant.ProductVariantID}`,
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        params: { _method: 'PUT' }
                    }
                );
            } else {
                // Xử lý create
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

                await axios.post(
                    `${API_BASE_URL}/product-variants`,
                    formDataToSend,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            }
            
            alert('Lưu biến thể thành công!');
            onSubmit();
        } catch (error) {
            console.error('Lỗi khi lưu biến thể:', error);
            
            if (error.response?.data?.errors) {
                const serverErrors = {};
                Object.keys(error.response.data.errors).forEach(key => {
                    serverErrors[key] = error.response.data.errors[key].join(', ');
                });
                setFieldErrors(serverErrors);
                
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert(`Lỗi từ server:\n${errorMessages}`);
            } else {
                alert('Lỗi khi lưu biến thể: ' + (error.response?.data.message || error.message));
            }
        } finally {
            setIsSubmitting(false);
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
                                    onBlur={handleBlur}
                                    required
                                    style={{ borderColor: fieldErrors.ProductID ? '#dc3545' : '' }}
                                />
                                {fieldErrors.ProductID && (
                                    <div className="error-message">{fieldErrors.ProductID}</div>
                                )}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>SKU:</label>
                            <input
                                type="text"
                                name="Sku"
                                value={formData.Sku}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                style={{ borderColor: fieldErrors.Sku ? '#dc3545' : '' }}
                            />
                            {fieldErrors.Sku && (
                                <div className="error-message">{fieldErrors.Sku}</div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label>Giá:</label>
                            <input
                                type="number"
                                name="Price"
                                value={formData.Price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                min="0"
                                step="1000"
                                style={{ borderColor: fieldErrors.Price ? '#dc3545' : '' }}
                            />
                            {fieldErrors.Price && (
                                <div className="error-message">{fieldErrors.Price}</div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label>Tồn kho:</label>
                            <input
                                type="number"
                                name="Stock"
                                value={formData.Stock}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                min="0"
                                style={{ borderColor: fieldErrors.Stock ? '#dc3545' : '' }}
                            />
                            {fieldErrors.Stock && (
                                <div className="error-message">{fieldErrors.Stock}</div>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-column">
                        <div className="form-group">
                            <label>Hình ảnh:</label>
                            
                            {/* Hiển thị ảnh hiện tại khi edit */}
                            {variant && currentImage && !imagePreview && (
                                <div style={{ marginBottom: '15px' }}>
                                    <p>Ảnh hiện tại:</p>
                                    <img
                                        src={currentImage}
                                        alt="Current product"
                                        style={{ 
                                            maxWidth: '150px', 
                                            maxHeight: '150px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        style={{
                                            marginTop: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Xóa ảnh
                                    </button>
                                </div>
                            )}
                            
                            {/* Input file để chọn ảnh mới */}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ borderColor: fieldErrors.Image ? '#dc3545' : '' }}
                            />
                            
                            {fieldErrors.Image && (
                                <div className="error-message">{fieldErrors.Image}</div>
                            )}
                            
                            {/* Hiển thị preview ảnh mới */}
                            {imagePreview && (
                                <div className="image-preview-container">
                                    <p>Ảnh mới:</p>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="image-preview"
                                        style={{ 
                                            maxWidth: '150px', 
                                            maxHeight: '150px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
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
                                    onBlur={(e) => handleAttributeChange(attr.AttributeID, e.target.value)}
                                    placeholder={`Nhập ${attr.name}`}
                                    data-attribute={`attribute_${attr.AttributeID}`}
                                    style={{ 
                                        borderColor: fieldErrors[`attribute_${attr.AttributeID}`] ? '#dc3545' : '' 
                                    }}
                                />
                                {fieldErrors[`attribute_${attr.AttributeID}`] && (
                                    <div className="error-message">
                                        {fieldErrors[`attribute_${attr.AttributeID}`]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                        style={{ 
                            backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? "Đang xử lý..." : (variant ? "Cập nhật" : "Thêm mới")}
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="cancel-btn"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductVariantForm;