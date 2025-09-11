import React, { useEffect, useState } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { message, Select, Input } from "antd";
import { formatPrice } from "../../../utils/formatPrice";
import {
  addOrder,
  clearCart,
  getPaymentGateways,
  getAvailableVouchers,
  updateUserProfile
} from "../../../api/api";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // State for shipping information
  const [receiverName, setReceiverName] = useState(user?.Fullname || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.Phone || "");
  const [address, setAddress] = useState(user?.Address || "");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for voucher and cart
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);

  // State for validation errors
  const [errors, setErrors] = useState({
    phone: "",
    address: "",
    payment: ""
  });

  // Check login
  if (!user || !token) {
    return <Navigate to="/cart" />;
  }

  // Initialize data from state
  useEffect(() => {
    if (state && state.cartItems && state.totalAmount) {
      setCartItems(state.cartItems);
      setTotalAmount(state.totalAmount);
      setTotalAfterDiscount(state.totalAmount);
    }
  }, [state]);

  // Load additional data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get payment methods
        const paymentResponse = await getPaymentGateways();
        if (paymentResponse.data && paymentResponse.data.success) {
          setPaymentMethods(paymentResponse.data.data || []);
        }

        // Get vouchers
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

  // Handle voucher selection
  const handleVoucherChange = (voucherId) => {
    setSelectedVoucher(voucherId);

    if (!voucherId) {
      setDiscount(0);
      setTotalAfterDiscount(totalAmount);
      return;
    }

    const voucher = vouchers.find(v => v.VoucherID === voucherId);
    if (voucher) {
      const discountValue = voucher.Value;
      setDiscount(discountValue);
      setTotalAfterDiscount(totalAmount - discountValue);
    }
  };

  // Validate phone number
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{8}$/;
    if (!phone) {
      return "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(phone)) {
      return "Số điện thoại phải là 8 chữ số";
    }
    return "";
  };

  // Validate address with more sophisticated checks
  const validateAddress = (address) => {
    if (!address) {
      return "Địa chỉ không được để trống";
    } else if (address.length < 10) {
      return "Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn";
    } else if (address.length > 200) {
      return "Địa chỉ quá dài, vui lòng rút ngắn lại";
    }

    // Check for meaningless/repeating characters
    const repeatingCharRegex = /(.)\1{5,}/; // 5 or more repeating characters
    if (repeatingCharRegex.test(address)) {
      return "Địa chỉ chứa ký tự lặp lại không hợp lệ";
    }

    // Check for minimum number of words (at least 2 meaningful words)
    const words = address.trim().split(/\s+/).filter(word => word.length > 2);
    if (words.length < 2) {
      return "Địa chỉ phải chứa ít nhất 2 từ có nghĩa";
    }

    // Check for Vietnamese characters and meaningful patterns
    const hasVietnameseChars = /[àáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(address);
    const hasLetters = /[a-z]/i.test(address);
    const hasNumbers = /[0-9]/.test(address);

    // If no Vietnamese characters, check for meaningful word patterns
    if (!hasVietnameseChars && hasLetters) {
      // Check for random character sequences (like "kffjjjjjjjj")
      const randomCharPattern = /\b([a-z])\1{2,}\b/i; // Words with 3+ repeating chars
      if (randomCharPattern.test(address)) {
        return "Địa chỉ chứa từ không có nghĩa";
      }

      // Check for minimum meaningful content
      const meaningfulWordCount = words.filter(word => {
        // A word is considered meaningful if it has vowel-consonant patterns
        const hasVowels = /[aeiouy]/i.test(word);
        const consonantCount = (word.match(/[bcdfghjklmnpqrstvwxz]/gi) || []).length;
        return hasVowels && consonantCount > 0;
      }).length;

      if (meaningfulWordCount < 2) {
        return "Địa chỉ phải chứa từ có nghĩa";
      }
    }

    return "";
  };

  // Validate voucher
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

  // Handle input changes with validation
  const handlePhoneChange = (value) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    setReceiverPhone(numericValue);

    // Validate and set error
    const error = validatePhone(numericValue);
    setErrors(prev => ({ ...prev, phone: error }));
  };

  const handleAddressChange = (value) => {
    setAddress(value);

    // Validate and set error
    const error = validateAddress(value);
    setErrors(prev => ({ ...prev, address: error }));
  };

  const handlePaymentChange = (value) => {
    setPaymentId(value);

    // Clear payment error when a method is selected
    if (value) {
      setErrors(prev => ({ ...prev, payment: "" }));
    }
  };

  // Update user profile information
  const updateUserInfo = async () => {
    try {
      const updateData = {};

      // Only update fields that are missing in user profile
      if (!user.Phone && receiverPhone) {
        updateData.Phone = receiverPhone;
      }

      if (!user.Address && address) {
        updateData.Address = address;
      }

      if (!user.Fullname && receiverName) {
        updateData.Fullname = receiverName;
      }

      // If there's data to update
      if (Object.keys(updateData).length > 0) {
        await updateUserProfile(user.UserID, updateData, token);

        // Update local storage
        const updatedUser = { ...user, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        message.success("Thông tin của bạn đã được cập nhật");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating user profile:", error);
      message.warning("Không thể cập nhật thông tin người dùng, nhưng đơn hàng vẫn sẽ được đặt.");
      return false;
    }
  };

  // Process order
  const handlePlaceOrder = async () => {
    // Validate all fields
    const phoneError = validatePhone(receiverPhone);
    const addressError = validateAddress(address);
    const paymentError = !paymentId ? "Vui lòng chọn phương thức thanh toán" : "";

    setErrors({
      phone: phoneError,
      address: addressError,
      payment: paymentError
    });

    if (phoneError || addressError || paymentError || !validateVoucher()) {
      message.warning("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    if (!receiverName) {
      message.warning("Vui lòng nhập tên người nhận.");
      return;
    }

    setLoading(true);
    try {
      // Update user profile information if needed
      await updateUserInfo();

      const orderData = {
        UserID: user.UserID,
        Total_amount: totalAfterDiscount,
        Receiver_name: receiverName,
        Receiver_phone: receiverPhone,
        Shipping_address: address,
        PaymentID: paymentId,
        VoucherID: selectedVoucher,
        Status: "pending",
        order_details: cartItems.map(item => ({
          ProductVariantID: item.ProductVariantID,
          Quantity: item.Quantity,
          Unit_price: item.product_variant?.Price || 0,
          Subtotal: (item.product_variant?.Price || 0) * item.Quantity,
        })),
      };

      // Handle VNPay payment
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

        // Check if server also updated user info
        if (response.data.user_updated) {
          const updatedUser = { ...user, ...response.data.updated_user_data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        await clearCart();
        message.success("Đặt hàng thành công!");

        // Pass order data to ThankYou page
        navigate("/thank-you", {
          state: {
            order: response.data.data,
            orderDetails: cartItems,
            voucher: vouchers.find(v => v.VoucherID === selectedVoucher),
            discount,
            totalAfterDiscount,
            paymentMethod: paymentMethods.find(m => m.PaymentID === paymentId)
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

  const renderAttributes = (variant) => {
    if (!variant || !variant.attributes || variant.attributes.length === 0) {
      return null;
    }

    return (
      <div className="attribute-tags">
        {variant.attributes.map((attr, index) => (
          <span key={index} className="attribute-tag">
            {attr.value}
            {index < variant.attributes.length - 1 && <span> | </span>}
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
            {/* Product list */}
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
                      {/* Display variant attributes */}
                      {renderAttributes(item.product_variant)}
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

            {/* Payment form */}
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
                  placeholder="Số điện thoại (11 chữ số)"
                  value={receiverPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  maxLength={11}
                  className="tw-mb-1"
                />
                {errors.phone && <div className="tw-text-red-500 tw-text-sm tw-mb-3">{errors.phone}</div>}

                <Input.TextArea
                  rows={3}
                  placeholder="Địa chỉ giao hàng (ví dụ: Số 123, đường Nguyễn Văn A, phường B, quận C)"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="tw-mb-1"
                />
                {errors.address && <div className="tw-text-red-500 tw-text-sm tw-mb-3">{errors.address}</div>}

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
                  onChange={handlePaymentChange}
                  status={errors.payment ? "error" : ""}
                >
                  {paymentMethods.map((method) => (
                    <Select.Option key={method.PaymentID} value={method.PaymentID}>
                      {method.Name}
                    </Select.Option>
                  ))}
                </Select>
                {errors.payment && <div className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.payment}</div>}

                {/* Order summary */}
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
          margin: 5px 0;
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
