import React, { useState, useEffect } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Dữ liệu mẫu
  const mockProducts = [
    {
      id: 1,
      name: "Sản phẩm 1",
      description: "Mô tả sản phẩm 1",
      price: 100000,
      stock: 50,
      category: "Điện tử",
      status: "active",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Sản phẩm 2",
      description: "Mô tả sản phẩm 2",
      price: 200000,
      stock: 30,
      category: "Thời trang",
      status: "active",
      image: "https://via.placeholder.com/100",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Cập nhật sản phẩm
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...productData } : p
      ));
      setEditingProduct(null);
    } else {
      // Thêm sản phẩm mới
      const newProduct = {
        id: Date.now(),
        ...productData,
        status: "active",
      };
      setProducts([...products, newProduct]);
    }
    setShowAddForm(false);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Quản lý sản phẩm</h2>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
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
          {products.map((product) => (
            <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
              </td>
              <td style={{ padding: 12 }}>{product.name}</td>
              <td style={{ padding: 12 }}>
                {product.price.toLocaleString("vi-VN")} VNĐ
              </td>
              <td style={{ padding: 12 }}>{product.stock}</td>
              <td style={{ padding: 12 }}>{product.category}</td>
              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: product.status === "active" ? "#d4edda" : "#f8d7da",
                    color: product.status === "active" ? "#155724" : "#721c24",
                  }}
                >
                  {product.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td style={{ padding: 12 }}>
                <button
                  onClick={() => handleEditProduct(product)}
                  style={{
                    marginRight: 8,
                    padding: "4px 8px",
                    background: "#ffc107",
                    color: "black",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{
                    padding: "4px 8px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component form để thêm/sửa sản phẩm
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
    image: product?.image || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ marginBottom: 20, padding: 20, background: "#f8f9fa", borderRadius: 8 }}>
      <h3>{product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="number"
            placeholder="Giá"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="number"
            placeholder="Tồn kho"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="text"
            placeholder="Danh mục"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
          <input
            type="url"
            placeholder="URL hình ảnh"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            required
          />
        </div>
        <textarea
          placeholder="Mô tả sản phẩm"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ 
            width: "100%", 
            padding: 8, 
            marginTop: 10,
            borderRadius: 4, 
            border: "1px solid #ddd",
            minHeight: 100 
          }}
          required
        />
        <div style={{ marginTop: 10 }}>
          <button
            type="submit"
            style={{
              marginRight: 10,
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {product ? "Cập nhật" : "Thêm"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProducts;