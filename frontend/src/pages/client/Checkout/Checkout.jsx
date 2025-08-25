import React, { useEffect, useState } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { message, Select, Input } from "antd";
import { formatPrice } from "../../../utils/formatPrice";
import { 
  addOrder, 
  clearCart, 
  getPaymentGateways, 
  getAvailableVouchers
} from "../../../api/api";

const Checkout = () => {
  const { state } = useLocation(); // Nhận state từ router
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  // State cho thông tin giao hàng
  const [receiverName, setReceiverName] = useState(user?.Fullname || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.Phone || "");
  const [address, setAddress] = useState(user?.Address || "");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho voucher và giỏ hàng
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);

  // Kiểm tra đăng nhập
  if (!user || !token) {
    return <Navigate to="/cart" />;
  }

  // Khởi tạo dữ liệu từ state
  useEffect(() => {
    if (state && state.cartItems && state.totalAmount) {
      setCartItems(state.cartItems);
      setTotalAmount(state.totalAmount);
      setTotalAfterDiscount(state.totalAmount);
    }
  }, [state]);

  // Load dữ liệu bổ sung
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy phương thức thanh toán
        const paymentResponse = await getPaymentGateways();
        if (paymentResponse.data && paymentResponse.data.success) {
          setPaymentMethods(paymentResponse.data.data || []);
        }
        
        // Lấy voucher
        const voucherResponse = await getAvailableVouchers();
        if (voucherResponse.data && voucherResponse.data.success) {
          setVouchers(voucherResponse.data.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        message.error("Không tải được dữ liệu thanh toán.");
      }
    };
    
    fetchData();
  }, []);

  // Xử lý khi chọn voucher
  const handleVoucherChange = (voucherId) => {
    setSelectedVoucher(voucherId);
    
    if (!voucherId) {
      setDiscount(0);
      setTotalAfterDiscount(totalAmount);
      return;
    }
    
    const voucher = vouchers.find(v => v.VoucherID === voucherId);
    if (voucher) {
      // Giả sử tất cả voucher đều là giảm giá cố định
      const discountValue = voucher.Value;
      
      setDiscount(discountValue);
      setTotalAfterDiscount(totalAmount - discountValue);
    }
  };

  // Kiểm tra voucher hợp lệ
  const validateVoucher = () => {
    if (!selectedVoucher) return true;
    
    const voucher = vouchers.find(v => v.VoucherID === selectedVoucher);
    if (!voucher) return false;
    
    const now = new Date();
    const expiryDate = new Date(voucher.Expiry_date);
    
    if (now > expiryDate) {
      message.warning("Voucher đã hết hạn sử dụng");
      return false;
    }
    
    if (voucher.Quantity <= 0) {
      message.warning("Voucher đã hết lượt sử dụng");
      return false;
    }
    
    if (totalAmount < voucher.Value) {
      message.warning("Giá trị đơn hàng không đủ để áp dụng voucher");
      return false;
    }
    
    return true;
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    // Validate thông tin
    if (!receiverName || !receiverPhone || !address || !paymentId) {
      message.warning("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    
    if (!validateVoucher()) return;

    setLoading(true);
    try {
      const orderData = {
        UserID: user.UserID,
        Total_amount: totalAfterDiscount,
        Receiver_name: receiverName,
        Receiver_phone: receiverPhone,
        Shipping_address: address,
        PaymentID: paymentId,
        VoucherID: selectedVoucher,
        Status: "pending", // Thêm trạng thái mặc định
        order_details: cartItems.map(item => ({
          ProductVariantID: item.ProductVariantID,
          Quantity: item.Quantity,
          Unit_price: item.product_variant?.Price || 0,
          Subtotal: (item.product_variant?.Price || 0) * item.Quantity,
        })),
      };

      // Xử lý thanh toán VNPay
      if (paymentId === 9) {
        const response = await fetch('http://localhost:8000/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        const data = await response.json();
        if (data.success && data.paymentUrl) {
          window.location.href = data.paymentUrl;
          return;
        } else {
          throw new Error(data.error || "Lỗi chuyển hướng VNPay");
        }
      } else {
        const response = await addOrder(orderData);
        await clearCart();
        message.success("Đặt hàng thành công!");
        
        // Truyền dữ liệu đơn hàng sang trang ThankYou
        navigate("/thank-you", { 
          state: { 
            order: response.data.data, // Dữ liệu đơn hàng từ API
            orderDetails: cartItems, // Chi tiết đơn hàng
            voucher: vouchers.find(v => v.VoucherID === selectedVoucher), // Voucher đã chọn
            discount, // Giảm giá
            totalAfterDiscount, // Tổng thanh toán
            paymentMethod: paymentMethods.find(m => m.PaymentID === paymentId) // Phương thức thanh toán
          } 
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      message.error(error.message || "Có lỗi khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="tw-text-[28px] tw-font-bold tw-text-[#1A1C20]">Thanh toán</h2>
          <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-mt-8">
            {/* Danh sách sản phẩm */}
            <div className="tw-col-span-7">
              {cartItems.length === 0 ? (
                <div className="tw-text-center tw-py-10">
                  <p>Giỏ hàng của bạn đang trống</p>
                  <button 
                    onClick={() => navigate("/products")}
                    className="tw-mt-4 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-py-2 tw-px-4 tw-rounded"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <section
                    key={item.CartItemID}
                    className="tw-rounded tw-border tw-border-solid tw-border-[#EEEEEE] tw-p-4 tw-flex tw-items-center tw-gap-4 tw-mb-4"
                  >
                    <img
                      src={
                        item.product_variant?.Image
                          ? `http://localhost:8000/storage/${item.product_variant.Image}`
                          : (item.product_variant?.product?.Image
                              ? `http://localhost:8000/storage/${item.product_variant.product.Image}`
                              : "/default-product.jpg")
                      }
                      alt={item.product_variant?.product?.Name || "Sản phẩm"}
                      className="tw-size-28 tw-object-cover tw-rounded"
                    />
                    <div>
                      <p className="tw-m-0 tw-font-bold tw-text-lg">
                        {item.product_variant?.product?.Name || "Tên sản phẩm"}
                      </p>
                      {/* Hiển thị thuộc tính biến thể */}
                      {item.product_variant?.attributes && item.product_variant.attributes.length > 0 && renderAttributes(item.product_variant.ProductVariantID)}
                      <p className="tw-text-[#757575]">
                        Số lượng: {item.Quantity}
                      </p>
                      <p className="tw-text-[#1A1C20] tw-font-bold">
                        {formatPrice((item.product_variant?.Price || 0) * item.Quantity)}
                      </p>
                    </div>
                  </section>
                ))
              )}
            </div>

            {/* Form thanh toán */}
            <div className="tw-col-span-5">
              <section className="tw-border tw-border-solid tw-border-[#EEEEEE] tw-p-4 tw-rounded">
                <h3 className="tw-text-xl tw-font-bold tw-mb-4">Thông tin giao hàng</h3>
                <Input
                  placeholder="Tên người nhận"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="tw-mb-3"
                />
                <Input
                  placeholder="Số điện thoại"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="tw-mb-3"
                />
                <Input.TextArea
                  rows={3}
                  placeholder="Địa chỉ giao hàng"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="tw-mb-3"
                />

                <h3 className="tw-text-xl tw-font-bold tw-mb-4">Voucher giảm giá</h3>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn voucher"
                  onChange={handleVoucherChange}
                  value={selectedVoucher}
                  allowClear
                >
                  <Select.Option value={null}>Không sử dụng voucher</Select.Option>
                  {vouchers.map((voucher) => (
                    <Select.Option key={voucher.VoucherID} value={voucher.VoucherID}>
                      {voucher.Code} - Giảm {formatPrice(voucher.Value)}
                      {voucher.Expiry_date && ` (HSD: ${new Date(voucher.Expiry_date).toLocaleDateString()})`}
                    </Select.Option>
                  ))}
                </Select>

                <h3 className="tw-text-xl tw-font-bold tw-mt-6 tw-mb-4">Phương thức thanh toán</h3>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn phương thức thanh toán"
                  onChange={(value) => setPaymentId(value)}
                >
                  {paymentMethods.map((method) => (
                    <Select.Option key={method.PaymentID} value={method.PaymentID}>
                      {method.Name}
                    </Select.Option>
                  ))}
                </Select>

                {/* Tóm tắt đơn hàng */}
                <div className="tw-mt-6 tw-space-y-3">
                  <div className="tw-flex tw-justify-between">
                    <p className="tw-m-0">Tổng tiền:</p>
                    <p className="tw-m-0 tw-font-bold">{formatPrice(totalAmount)}</p>
                  </div>
                  
                  {discount > 0 && (
                    <div className="tw-flex tw-justify-between">
                      <p className="tw-m-0">Giảm giá:</p>
                      <p className="tw-m-0 tw-font-bold tw-text-red-500">-{formatPrice(discount)}</p>
                    </div>
                  )}
                  
                  <div className="tw-flex tw-justify-between tw-border-t tw-border-gray-200 tw-pt-3">
                    <p className="tw-m-0 tw-font-bold">Tổng thanh toán:</p>
                    <p className="tw-m-0 tw-font-bold tw-text-lg tw-text-[#1A1C20]">
                      {formatPrice(totalAfterDiscount)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                  className="tw-bg-[#99CCD0] hover:tw-bg-[#88bbbf] tw-text-white tw-font-medium tw-px-4 tw-h-12 tw-uppercase tw-w-full tw-mt-6 tw-rounded disabled:tw-opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>

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
      `}</style>
    </>
  );
};

export default Checkout;