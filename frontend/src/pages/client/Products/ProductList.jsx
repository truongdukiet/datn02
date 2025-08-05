import React, { useEffect, useState } from "react";
import { getProducts, addToCart } from '../../../api/api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.data || []);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert('Đã thêm vào giỏ hàng!');
    } catch (err) {
      alert('Lỗi khi thêm vào giỏ hàng');
      console.error('Add to cart error:', err);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      <h2>Danh sách sản phẩm</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image && (
                <img
                  src={`http://localhost:8000/storage/${product.image}`}
                  alt={product.name || "Không có tên"}
                  className="tw-w-full tw-h-full tw-object-cover tw-absolute tw-top-0 tw-left-0"
                />
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">{product.price?.toLocaleString('vi-VN')} VNĐ</p>
              <p className="description">{product.description}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product.id)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
