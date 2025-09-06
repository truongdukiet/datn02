import React, { useEffect, useState, useCallback, useMemo } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { Link, Navigate } from "react-router-dom";
import { Checkbox, message } from "antd";
import { formatPrice } from "../../../utils/formatPrice";
import apiClient from "../../../api/api";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [variantAttributes, setVariantAttributes] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await apiClient.get("/api/carts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(response.data.cart_items);

        // Tự động chọn tất cả sản phẩm khi giỏ hàng được tải
        const allItemIds = response.data.cart_items.map(item => item.ProductVariantID);
        setSelectedItems(allItemIds);
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchAllVariantAttributes(cartItems);
    }
  }, [cartItems]);

  const fetchAllVariantAttributes = async (cartItemsData) => {
    try {
        const attributesMap = {};
        const API_BASE_URL = 'http://localhost:8000/api';

        const attributePromises = cartItemsData.map(async (item) => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/variant-attributes?variant_id=${item.ProductVariantID}`
                );
                const filteredAttributes = (response.data.data || []).filter(
                    attr => attr.ProductVariantID === item.ProductVariantID
                );
                attributesMap[item.ProductVariantID] = filteredAttributes;
            } catch (error) {
                console.error(`Error fetching attributes for variant ${item.ProductVariantID}:`, error);
                attributesMap[item.ProductVariantID] = [];
            }
        });

        await Promise.all(attributePromises);
        setVariantAttributes(attributesMap);
    } catch (error) {
        console.error('Error fetching variant attributes:', error);
    }
  };

  const handleRemoveItem = async (productVariantId) => {
    try {
      await apiClient.delete("/api/carts/item", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { ProductVariantID: productVariantId },
      });
      setCartItems(prevItems => prevItems.filter(item => item.ProductVariantID !== productVariantId));
      setSelectedItems(prevSelected => prevSelected.filter(id => id !== productVariantId));
      message.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  const handleUpdateItem = async (productVariantId, quantity) => {
    try {
      const newQuantity = parseInt(quantity);
      if (isNaN(newQuantity) || newQuantity < 1) {
        message.warning("Số lượng phải là một số và lớn hơn 0.");
        return;
      }

      await apiClient.put("/api/carts", {
        ProductVariantID: productVariantId,
        Quantity: newQuantity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Số lượng sản phẩm đã được cập nhật.");

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.ProductVariantID === productVariantId ? { ...item, Quantity: newQuantity } : item
        )
      );
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  // Sửa đổi hàm xử lý chọn sản phẩm
  const handleSelectItem = useCallback((productVariantId) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(productVariantId)) {
        return prevSelected.filter(id => id !== productVariantId);
      } else {
        return [...prevSelected, productVariantId];
      }
    });
  }, []);

  // Sửa đổi hàm chọn tất cả
  const handleSelectAll = useCallback(() => {
    setSelectedItems(prevSelected => {
      if (prevSelected.length === cartItems.length) {
        return [];
      } else {
        return cartItems.map(item => item.ProductVariantID);
      }
    });
  }, [cartItems]);

  const selectedTotalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.ProductVariantID)) {
        const price = item.product_variant?.Price || 0;
        const quantity = item.Quantity || 0;
        return total + (price * quantity);
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item.product_variant?.Price || 0;
      const quantity = item.Quantity || 0;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

  const getSelectedItems = useCallback(() => {
    return cartItems.filter(item => selectedItems.includes(item.ProductVariantID));
  }, [cartItems, selectedItems]);

  const hasSelectedItems = selectedItems.length > 0;

  const renderAttributes = (variantId) => {
    const attributes = variantAttributes[variantId] || [];
    if (!attributes.length) return null;

    return (
        <div className="attribute-tags">
            {attributes.map((attr, index) => (
                <span key={index} className="attribute-tag">
                    {attr.value}
                    {index < attributes.length - 1 && <span> | </span>}
                </span>
            ))}
        </div>
    );
  };

  return (
    <>
      <ClientHeader lightMode={false} />
      <main className="tw-min-h-[80vh] tw-pt-24 container">
        <div className="tw-my-6">
          <div className="tw-flex tw-items-center tw-gap-5">
            <Link to="/" className="tw-text-[#9E9E9E]">Trang chủ</Link>
            <div className="tw-text-[#9E9E9E]"><i className="fa-solid fa-chevron-right"></i></div>
            <p className="tw-text-[#1A1C20] tw-font-bold tw-m-0">Giỏ hàng</p>
          </div>

          {loading ? (
            <p>Đang tải giỏ hàng...</p>
          ) : (
            <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-mt-8">
              <div className="tw-col-span-7">
                <div className="tw-border tw-solid tw-border-[#EEEEEE] tw-rounded tw-p-4">
                  <Checkbox
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                    onChange={handleSelectAll}
                  >
                    <p className="tw-font-bold tw-text-xl tw-text-[#1A1C20] tw-m-0">Chọn tất cả ({selectedItems.length}/{cartItems.length})</p>
                  </Checkbox>
                </div>

                <div className="tw-mt-4 tw-flex tw-flex-col tw-gap-y-4">
                  {cartItems.map(item => {
                    // Lấy đúng ảnh biến thể
                    console.log(item);

                    const variantImage = item.product_variant?.Image
                      ? `http://localhost:8000/storage/${item.product_variant.Image}`
                      : (item.product_variant?.product?.Image
                          ? `http://localhost:8000/storage/${item.product_variant.product.Image}`
                          : "default_image.jpg");

                    return (
                      <section key={item.CartItemID} className="tw-rounded tw-border tw-border-solid tw-border-[#EEEEEE] tw-p-4 tw-flex tw-items-center tw-gap-4">
                        <Checkbox
                          checked={selectedItems.includes(item.ProductVariantID)}
                          onChange={() => handleSelectItem(item.ProductVariantID)}
                        />
                        <img
                          src={variantImage}
                          alt={item.product_variant?.product?.Name || "Không có tên"}
                          className="tw-size-28 tw-object-cover tw-rounded"
                        />
                        <div className="tw-flex-1">
                          <p className="tw-m-0 tw-font-bold tw-text-xl tw-text-[#1A1C20]">
                            {item.product_variant?.product?.Name || "Tên sản phẩm không xác định"}
                          </p>
                          {renderAttributes(item.ProductVariantID)}
                          <p className="tw-my-3 tw-flex tw-items-center tw-gap-x-3">
                            <span className="tw-text-sm tw-text-[#757575] tw-line-through">
                              {formatPrice(item.product_variant?.Price)}
                            </span>
                            <span className="tw-text-[#1A1C20]">
                              {formatPrice(item.product_variant?.Price * item.Quantity)}
                            </span>
                          </p>
                          <div className="tw-inline-flex tw-items-center tw-gap-x-2 tw-border tw-border-solid tw-border-[#EEEEEE] tw-rounded-full tw-h-9">
                            <div className="tw-pl-4 tw-pr-2 tw-cursor-pointer" onClick={() => handleUpdateItem(item.ProductVariantID, item.Quantity - 1)}>
                              <i className="fa-solid fa-minus"></i>
                            </div>
                            <input
                              type="number"
                              value={item.Quantity}
                              className="tw-text-center tw-bg-transparent tw-outline-none tw-border-none tw-w-8 tw-text-black"
                              onChange={(e) => handleUpdateItem(item.ProductVariantID, e.target.value)}
                            />
                            <div className="tw-pr-4 tw-pl-2 tw-cursor-pointer" onClick={() => handleUpdateItem(item.ProductVariantID, item.Quantity + 1)}>
                              <i className="fa-solid fa-plus"></i>
                            </div>
                          </div>
                        </div>
                        <div className="tw-ml-auto tw-cursor-pointer tw-text-xl" onClick={() => handleRemoveItem(item.ProductVariantID)}>
                          <i className="fa-solid fa-trash"></i>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>

              <div className="tw-col-span-5">
                <section className="tw-border tw-border-solid tw-border-[#EEEEEE] tw-px-4 tw-py-6">
                  <h2 className="tw-text-center tw-text-[#1A1C20] tw-text-[32px] tw-font-bold tw-rounded tw-pb-6">Thông tin thanh toán</h2>
                  <div className="tw-flex tw-flex-col tw-gap-y-3">
                    <div className="tw-flex tw-items-center tw-justify-between">
                      <p className="tw-m-0">Tổng đơn hàng</p>
                      <p className="tw-m-0 tw-font-bold tw-text-xl tw-text-[#1A1C20]">
                        {hasSelectedItems ? formatPrice(selectedTotalAmount) : "0₫"}
                      </p>
                    </div>
                    <div className="tw-flex tw-items-center tw-justify-between">
                      <p className="tw-m-0">Số sản phẩm</p>
                      <p className="tw-m-0 tw-text-[#1A1C20]">
                        {hasSelectedItems ? `${selectedItems.length} sản phẩm được chọn` : "0 sản phẩm được chọn"}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <Link
                    to="/checkout"
                    state={{
                      cartItems: hasSelectedItems ? getSelectedItems() : [],
                      totalAmount: hasSelectedItems ? selectedTotalAmount : 0,
                      variantAttributes
                    }}
                    className={`tw-bg-[#99CCD0] tw-text-white tw-font-medium tw-px-4 tw-h-12 tw-uppercase tw-flex tw-items-center tw-justify-center tw-w-full tw-mt-6 ${
                      !hasSelectedItems ? "tw-opacity-50 tw-cursor-not-allowed" : "tw-cursor-pointer"
                    }`}
                    onClick={(e) => {
                      if (!hasSelectedItems) {
                        e.preventDefault();
                        message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
                      }
                    }}
                  >
                    Thanh toán
                  </Link>
                  <Link to="/" className="tw-flex tw-items-center tw-justify-center tw-gap-x-2 tw-text-[#1A1C20] tw-mt-6">
                    <div className="tw-text-sm tw-text-[#1A1C20]"><i className="fa-solid fa-chevron-left"></i></div>
                    <p className="tw-m-0 tw-text-[#1A1C20] tw-font-normal">Quay lại mua hàng</p>
                  </Link>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;
