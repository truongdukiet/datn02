import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // API Base URL
  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data.data || []); // Ensure products is always an array
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${productId}`);
        setProducts(products.filter(product => product.ProductID !== productId));
      } catch (err) {
        setError("Error deleting product");
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        await axios.put(`${API_BASE_URL}/products/${editingProduct.ProductID}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Set the content type for FormData
          }
        });
      } else {
        // Add new product
        await axios.post(`${API_BASE_URL}/products`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Set the content type for FormData
          }
        });
      }
      fetchProducts(); // Refresh the product list
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError("Error saving product");
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Quản lý sản phẩm</h2>
        <button
          onClick={() => setShowAddForm(true)}
          style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
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
          }}
        />
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Hình ảnh</th>
            <th style={{ padding: 12, textAlign: "left" }}>Tên sản phẩm</th>
            <th style={{ padding: 12, textAlign: "left" }}>Giá</th>
            <th style={{ padding: 12, textAlign: "left" }}>Tồn kho</th>
            <th style={{ padding: 12, textAlign: "left" }}>Danh mục</th>
            <th style={{ padding: 12, textAlign: "left" }}>Trạng thái</th>
            <th style={{ padding: 12, textAlign: "left" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.ProductID} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>
                  <img 
                    src={product.Image ? `http://localhost:8000/storage/${product.Image}` : "https://via.placeholder.com/100"} 
                    alt={product.Name} 
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                </td>
                <td style={{ padding: 12 }}>{product.Name}</td>
                <td style={{ padding: 12 }}>{parseInt(product.base_price).toLocaleString("vi-VN")} VNĐ</td>
                <td style={{ padding: 12 }}>{product.variants.reduce((total, variant) => total + variant.Stock, 0)}</td>
                <td style={{ padding: 12 }}>{product.category?.Name}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: "4px 8px", borderRadius: 4, background: product.Status ? "#d4edda" : "#f8d7da", color: product.Status ? "#155724" : "#721c24" }}>
                    {product.Status ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{ marginRight: 8, padding: "4px 8px", background: "#ffc107", color: "black", border: "none", borderRadius: 4, cursor: "pointer" }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.ProductID)}
                    style={{ padding: "4px 8px", background: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>Không có sản phẩm nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Component form để thêm/sửa sản phẩm
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: product?.Name || "",
    Description: product?.Description || "",
    base_price: product?.base_price || "",
    Stock: product?.variants?.[0]?.Stock || "", // Assume first variant for simplicity
    CategoryID: product?.CategoryID || "",
    Image: product?.Image || "",
  });
  
  const [imageFile, setImageFile] = useState(null); // State for the image file

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Save the file in state
    setFormData({ ...formData, Image: file.name }); // Optional: Store file name (not necessary)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });

    // Append the image file if selected
    if (imageFile) {
      formDataToSubmit.append('image_file', imageFile); // Ensure this key matches your backend
    }

    await onSave(formDataToSubmit); // Send FormData to the save function
  };

  return (
    <div style={{ marginBottom: 20, padding: 20, background: "#f8f9fa", borderRadius: 8 }}>
      <h3>{product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="number"
            placeholder="Giá"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="number"
            placeholder="Tồn kho"
            value={formData.Stock}
            onChange={(e) => setFormData({ ...formData, Stock: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="text"
            placeholder="Danh mục ID"
            value={formData.CategoryID}
            onChange={(e) => setFormData({ ...formData, CategoryID: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
          />
        </div>
        <textarea
          placeholder="Mô tả sản phẩm"
          value={formData.Description}
          onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
          style={{ width: "100%", padding: 8, marginTop: 10, borderRadius: 4, border: "1px solid #ddd", minHeight: 100 }}
          required
        />
        <div style={{ marginTop: 10 }}>
          <button
            type="submit"
            style={{ marginRight: 10, padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            {product ? "Cập nhật" : "Thêm"}
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

export default AdminProducts;