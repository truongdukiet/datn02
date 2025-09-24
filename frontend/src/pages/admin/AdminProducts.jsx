import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data.data || []);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${productId}`);
        setProducts(products.filter(product => product.ProductID !== productId));
        alert("Xóa sản phẩm thành công!");
      } catch (err) {
        console.error("Error deleting product", err);
        setError("Error deleting product");
        alert("Lỗi khi xóa sản phẩm.");
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
    setFormErrors({});
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        productData.append('_method', 'PATCH');
        await axios.post(`${API_BASE_URL}/products/${editingProduct.ProductID}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Cập nhật sản phẩm thành công!");
        fetchProducts();
        setShowAddForm(false);
        setEditingProduct(null);
        setFormErrors({});
      } else {
        // Thêm sản phẩm mới
        const response = await axios.post(`${API_BASE_URL}/products`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Thêm sản phẩm thành công!");
        // Lấy ProductID vừa tạo
        const newProductId = response.data.data?.ProductID || response.data.ProductID;
        // Chuyển sang trang tạo biến thể cho sản phẩm mới
        if (newProductId) {
          navigate(`/admin/product-variants/${newProductId}`);
        } else {
          fetchProducts();
        }
        setShowAddForm(false);
        setEditingProduct(null);
        setFormErrors({});
      }
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      
      // Hiển thị thông báo lỗi chi tiết từ server
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
        alert(`Lỗi validation: ${Object.values(err.response.data.errors).flat().join(', ')}`);
      } else {
        setError("Error saving product");
        alert("Lỗi khi lưu sản phẩm. Vui lòng kiểm tra console (F12) để xem chi tiết lỗi từ server.");
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ProductID?.toString().includes(searchTerm);
    const matchesCategory = filterCategory ? product.CategoryID === parseInt(filterCategory) : true;
    const matchesStatus = filterStatus ? product.Status.toString() === filterStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const ProductForm = ({ product, onSave, onCancel, categories }) => {
    const [formData, setFormData] = useState({
      Name: "",
      Description: "",
      base_price: "",
      CategoryID: "",
      Status: 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
      if (product) {
        setFormData({
          Name: product.Name || "",
          Description: product.Description || "",
          base_price: product.base_price || "",
          CategoryID: product.CategoryID || "",
          Status: product.Status !== undefined ? product.Status : 1
        });
        setImageFile(null);
        setImagePreview(product.Image ? `http://localhost:8000/storage/${product.Image}` : null);
      } else {
        setFormData({
          Name: "",
          Description: "",
          base_price: "",
          CategoryID: "",
          Status: 1
        });
        setImageFile(null);
        setImagePreview(null);
      }
      setFieldErrors({});
    }, [product]);

    const validateField = (name, value) => {
      let error = "";
      
      switch (name) {
        case "Name":
          if (!value.trim()) {
            error = "Tên sản phẩm không được để trống";
          } else if (!/^[a-zA-ZÀ-ỹ0-9\s\-\.,\(\)]{3,}$/.test(value)) {
            error = "Tên sản phẩm phải có ít nhất 3 ký tự và không chứa ký tự đặc biệt";
          }
          break;
        case "base_price":
          if (!value) {
            error = "Giá sản phẩm không được để trống";
          } else if (isNaN(value) || parseFloat(value) < 0) {
            error = "Giá sản phẩm phải là số dương";
          } else if (!/^\d+$/.test(value)) {
            error = "Giá sản phẩm phải là số tự nhiên";
          }
          break;
        case "CategoryID":
          if (!value) {
            error = "Vui lòng chọn danh mục sản phẩm";
          }
          break;
        case "Description":
          if (!value.trim()) {
            error = "Mô tả sản phẩm không được để trống";
          } else if (value.trim().length < 10) {
            error = "Mô tả sản phẩm phải có ít nhất 10 ký tự";
          }
          break;
        default:
          break;
      }
      
      return error;
    };

    const handleInputChange = (e) => {
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
      
      setImageFile(file);
      setFieldErrors({ ...fieldErrors, Image: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      setImageFile(null);
      setImagePreview(null);
      setFieldErrors({ ...fieldErrors, Image: '' });
      // Reset file input
      const fileInput = document.getElementById('product-image');
      if (fileInput) fileInput.value = '';
    };

    const validateForm = () => {
      const errors = {};
      
      // Validate all fields
      Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      });
      
      // Validate image for new product
      if (!product && !imageFile) {
        errors.Image = 'Vui lòng chọn ảnh cho sản phẩm';
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
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      setIsSubmitting(true);
      
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSubmit.append('Image', imageFile);
      }

      await onSave(formDataToSubmit);
      setIsSubmitting(false);
    };

    return (
      <div style={{ marginBottom: 20, padding: 20, background: "#f8f9fa", borderRadius: 8 }}>
        <h3>{product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <input
                type="text"
                name="Name"
                placeholder="Tên sản phẩm *"
                value={formData.Name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ 
                  padding: 8, 
                  borderRadius: 4, 
                  border: fieldErrors.Name ? "1px solid #dc3545" : "1px solid #ddd", 
                  width: "100%" 
                }}
                required
              />
              {fieldErrors.Name && (
                <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                  {fieldErrors.Name}
                </div>
              )}
            </div>
            <div>
              <input
                type="number"
                name="base_price"
                placeholder="Giá *"
                value={formData.base_price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ 
                  padding: 8, 
                  borderRadius: 4, 
                  border: fieldErrors.base_price ? "1px solid #dc3545" : "1px solid #ddd", 
                  width: "100%" 
                }}
                required
                min="0"
                step="1000"
              />
              {fieldErrors.base_price && (
                <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                  {fieldErrors.base_price}
                </div>
              )}
            </div>
            <div>
              <select
                name="CategoryID"
                value={formData.CategoryID}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ 
                  padding: 8, 
                  borderRadius: 4, 
                  border: fieldErrors.CategoryID ? "1px solid #dc3545" : "1px solid #ddd", 
                  width: "100%" 
                }}
                required
              >
                <option value="">Chọn danh mục *</option>
                {categories.map(cat => (
                  <option key={cat.CategoryID} value={cat.CategoryID}>
                    {cat.Name}
                  </option>
                ))}
              </select>
              {fieldErrors.CategoryID && (
                <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                  {fieldErrors.CategoryID}
                </div>
              )}
            </div>
            <div>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd", width: "100%" }}
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>
            <div>
              <input
                id="product-image"
                type="file"
                onChange={handleFileChange}
                style={{ 
                  padding: 8, 
                  borderRadius: 4, 
                  border: fieldErrors.Image ? "1px solid #dc3545" : "1px solid #ddd", 
                  width: "100%" 
                }}
                accept=".jpeg,.jpg,.png,.gif"
              />
              <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                Chỉ chấp nhận file JPEG, PNG, JPG, GIF (tối đa 5MB)
              </div>
              {fieldErrors.Image && (
                <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                  {fieldErrors.Image}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {imagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: 100, maxHeight: 100, objectFit: "contain" }} 
                  />
                  <button 
                    type="button"
                    onClick={removeImage}
                    style={{ 
                      position: "absolute", 
                      top: -10, 
                      right: -10, 
                      background: "#dc3545", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "50%", 
                      width: 24, 
                      height: 24, 
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div style={{ 
                  width: 100, 
                  height: 100, 
                  border: "2px dashed #ddd", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#999"
                }}>
                  Chưa có ảnh
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <textarea
              name="Description"
              placeholder="Mô tả sản phẩm *"
              value={formData.Description}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{ 
                width: "100%", 
                padding: 8, 
                borderRadius: 4, 
                border: fieldErrors.Description ? "1px solid #dc3545" : "1px solid #ddd", 
                minHeight: 100 
              }}
              required
            />
            {fieldErrors.Description && (
              <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.Description}
              </div>
            )}
          </div>
          {Object.keys(formErrors).length > 0 && (
            <div style={{ 
              marginTop: 10, 
              padding: 10, 
              background: "#f8d7da", 
              color: "#721c24", 
              borderRadius: 4,
              fontSize: "14px"
            }}>
              <strong>Lỗi validation:</strong>
              <ul style={{ margin: "5px 0", paddingLeft: 20 }}>
                {Object.entries(formErrors).map(([field, errors]) => (
                  <li key={field}>{errors.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ 
                marginRight: 10, 
                padding: "8px 16px", 
                background: isSubmitting ? "#6c757d" : "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: 4, 
                cursor: isSubmitting ? "not-allowed" : "pointer" 
              }}
            >
              {isSubmitting ? "Đang xử lý..." : (product ? "Cập nhật" : "Thêm")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Quản lý sản phẩm</h2>
      
      {/* Thanh tìm kiếm và bộ lọc */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 35px", borderRadius: 4, border: "1px solid #ddd" }}
          />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#888" }}>🔍</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd", flex: "1 1 150px" }}
        >
          <option value="">Loại sản phẩm</option>
          {categories.map(cat => (
            <option key={cat.CategoryID} value={cat.CategoryID}>{cat.Name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd", flex: "1 1 150px" }}
        >
          <option value="">Trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Không hoạt động</option>
        </select>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
            setFormErrors({});
          }}
          style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer", flex: "0 0 auto" }}
        >
          Thêm sản phẩm
        </button>
      </div>

      {showAddForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
            setFormErrors({});
          }}
          categories={categories}
        />
      )}

      {/* Bảng sản phẩm */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Hình ảnh</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Tên sản phẩm</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Giá</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Danh mục</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Trạng thái</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.ProductID} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 12 }}>
                    <img
                      src={product.Image ? `http://localhost:8000/storage/${product.Image}` : "https://via.placeholder.com/50"}
                      alt={product.Name}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                    />
                  </td>
                  <td style={{ padding: 12 }}>{product.Name}</td>
                  <td style={{ padding: 12 }}>{formatCurrency(product.base_price)}</td>
                  <td style={{ padding: 12 }}>{product.category?.Name}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: 4, 
                      background: product.Status === 1 ? "#d4edda" : "#f8d7da", 
                      color: product.Status === 1 ? "#155724" : "#721c24",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      {product.Status === 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{ marginRight: 8, padding: "6px 12px", background: "#ffc107", color: "black", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "14px" }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.ProductID)}
                      style={{ marginRight: 8, padding: "6px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "14px" }}
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => navigate(`/admin/product-variants/${product.ProductID}`)}
                      style={{ padding: "6px 12px", background: "#0d6efd", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "14px" }}
                    >
                      Biến thể
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;