import React, { useEffect, useState } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { message, Select, Input } from "antd";
import { formatPrice } from "../../../utils/formatPrice";
import { addOrder, clearCart, getPaymentGateways } from "../../../api/api";

const Checkout = () => {
  const { state } = useLocation(); // Lấy data từ Cart
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [receiverName, setReceiverName] = useState(user?.FullName || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.Phone || "");
  const [address, setAddress] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || !token || !state) {
    return <Navigate to="/cart" />;
  }

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await getPaymentGateways();
        if (response.data && response.data.success) {
          setPaymentMethods(response.data.data);
        }
      } catch (error) {
        message.error("Không tải được phương thức thanh toán.");
      }
    };
    fetchPaymentMethods();
  }, []);

  const handlePlaceOrder = async () => {
    if (!receiverName || !receiverPhone || !address || !paymentId) {
      message.warning("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        UserID: user.UserID,
        Total_amount: state.totalAmount,
        Receiver_name: receiverName,
        Receiver_phone: receiverPhone,
        Shipping_address: address,
        PaymentID: paymentId,
        VoucherID: null,
      };

      await addOrder(orderData);

      // Xóa giỏ hàng
      await clearCart();

      message.success("Đặt hàng thành công!");
      navigate("/thank-you"); // Điều hướng sang trang cảm ơn
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Có lỗi khi đặt hàng.");
    } finally {
      setLoading(false);
    }
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
              {state.cartItems.map((item) => (
                <section
                  key={item.CartItemID}
                  className="tw-rounded tw-border tw-border-solid tw-border-[#EEEEEE] tw-p-4 tw-flex tw-items-center tw-gap-4 tw-mb-4"
                >
                  <img
                    src={
                      item.product_variant?.product?.Image
                        ? `http://localhost:8000/storage/${item.product_variant.product.Image}`
                        : "default_image.jpg"
                    }
                    alt={item.product_variant?.product?.Name}
                    className="tw-size-28 tw-object-cover tw-rounded"
                  />
                  <div>
                    <p className="tw-m-0 tw-font-bold tw-text-lg">
                      {item.product_variant?.product?.Name}
                    </p>
                    <p className="tw-text-[#757575]">
                      Số lượng: {item.Quantity}
                    </p>
                    <p className="tw-text-[#1A1C20] tw-font-bold">
                      {formatPrice(item.product_variant?.Price * item.Quantity)}
                    </p>
                  </div>
                </section>
              ))}
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

                <h3 className="tw-text-xl tw-font-bold tw-mb-4">Phương thức thanh toán</h3>
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

                <div className="tw-flex tw-justify-between tw-my-4">
                  <p className="tw-m-0">Tổng tiền:</p>
                  <p className="tw-m-0 tw-font-bold">{formatPrice(state.totalAmount)}</p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="tw-bg-[#99CCD0] tw-text-white tw-font-medium tw-px-4 tw-h-12 tw-uppercase tw-w-full tw-mt-4"
                >
                  {loading ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Checkout;
