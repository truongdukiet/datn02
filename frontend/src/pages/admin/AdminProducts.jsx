import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thêm import này

const AdminProducts = () => {
  const navigate = useNavigate(); // Thêm hook navigate
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [categories, setCategories] = useState([]);

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
  };

  // ----- PHẦN ĐÃ CHỈNH SỬA LẠI -----
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Sử dụng lại cách POST với _method=PATCH vì đây là cách chuẩn cho Laravel
        productData.append('_method', 'PATCH');
        await axios.post(`${API_BASE_URL}/products/${editingProduct.ProductID}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/products`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Thêm sản phẩm thành công!");
      }
      fetchProducts();
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (err) {
      // Log lỗi chi tiết hơn từ server để dễ debug
      console.error("Error saving product:", err.response?.data || err.message);
      setError("Error saving product");
      alert("Lỗi khi lưu sản phẩm. Vui lòng kiểm tra console (F12) để xem chi tiết lỗi từ server.");
    }
  };
  // ----------------------------------

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ProductID?.toString().includes(searchTerm);
    const matchesCategory = filterCategory ? product.CategoryID === parseInt(filterCategory) : true;
    const matchesStatus = filterStatus ? (filterStatus === "active" ? product.Status : !product.Status) : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const ProductForm = ({ product, onSave, onCancel, categories }) => {
    const [formData, setFormData] = useState({
      Name: "",
      Description: "",
      base_price: "",
      Stock: "",
      CategoryID: "",
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
      if (product) {
        setFormData({
          Name: product.Name || "",
          Description: product.Description || "",
          base_price: product.base_price || "",
          Stock: product.variants?.[0]?.Stock || "",
          CategoryID: product.CategoryID || "",
        });
        setImageFile(null);
      } else {
        setFormData({
          Name: "",
          Description: "",
          base_price: "",
          Stock: "",
          CategoryID: "",
        });
        setImageFile(null);
      }
    }, [product]);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setImageFile(file);
    };

    // ----- PHẦN ĐÃ CHỈNH SỬA LẠI -----
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSubmit.append('Image', imageFile);  // ✅ phải đúng tên
      }


      await onSave(formDataToSubmit);
    };
    // ----------------------------------

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
            <select
              value={formData.CategoryID}
              onChange={(e) => setFormData({ ...formData, CategoryID: e.target.value })}
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map(cat => (
                <option key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.Name}
                </option>
              ))}
            </select>
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

  return (
    <div>
      {/* Thanh tìm kiếm và bộ lọc */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 10 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo mã sản phẩm, tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 35px", borderRadius: 4, border: "1px solid #ddd" }}
          />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#888" }}>🔍</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
        >
          <option value="">Loại sản phẩm</option>
          {categories.map(cat => (
            <option key={cat.CategoryID} value={cat.CategoryID}>{cat.Name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
        >
          <option value="">Trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <button
          style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Bộ lọc
        </button>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
          }}
          style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Thêm
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
          categories={categories}
        />
      )}

      {/* Bảng sản phẩm */}
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.ProductID} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>
                  <img
                  src={product.Image ? `http://localhost:8000/storage/${product.Image}` : "https://via.placeholder.com/100"}
                    alt={product.Name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                </td>
                <td style={{ padding: 12 }}>{product.Name}</td>
                <td style={{ padding: 12 }}>{formatCurrency(product.base_price)}</td>
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
                    style={{ marginRight: 8, padding: "4px 8px", background: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                  >
                    Xóa
                  </button>
                  {/* Thêm nút Biến thể */}
                  <button
                    onClick={() => navigate(`/admin/product-variants/${product.ProductID}`)}
                    style={{ padding: "4px 8px", background: "#0d6efd", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                  >
                    Biến thể
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

export default AdminProducts;