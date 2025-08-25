import React from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { formatPrice } from "../../../utils/formatPrice";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ThankYouPay = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract VNPay parameters from URL
  const vnpParams = {
    amount: searchParams.get("vnp_Amount"),
    bankCode: searchParams.get("vnp_BankCode"),
    bankTranNo: searchParams.get("vnp_BankTranNo"),
    cardType: searchParams.get("vnp_CardType"),
    orderInfo: searchParams.get("vnp_OrderInfo"),
    payDate: searchParams.get("vnp_PayDate"),
    responseCode: searchParams.get("vnp_ResponseCode"),
    tmnCode: searchParams.get("vnp_TmnCode"),
    transactionNo: searchParams.get("vnp_TransactionNo"),
    transactionStatus: searchParams.get("vnp_TransactionStatus"),
    txnRef: searchParams.get("vnp_TxnRef"),
    secureHash: searchParams.get("vnp_SecureHash"),
  };

  // Hàm trích xuất số cuối từ mã đơn hàng (ví dụ: "56" từ "INV-56")
  const extractOrderId = (txnRef) => {
    if (!txnRef) return null;

    // Tách chuỗi bằng dấu "-" và lấy phần cuối cùng
    const parts = txnRef.split('-');
    const lastPart = parts[parts.length - 1];

    // Chuyển thành số nếu có thể
    const orderId = parseInt(lastPart, 10);
    return isNaN(orderId) ? null : orderId;
  };
  const orderId = extractOrderId(vnpParams.txnRef);

  // Format VNPay amount (divide by 100)
  const formatVnpAmount = (amount) => {
    return amount ? amount / 100 : 0;
  };

  // Format VNPay payment date
  const formatVnpPayDate = (payDate) => {
    if (!payDate) return "";
    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);
    return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
  };

  // Fetch order details based on transaction reference
   useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          throw new Error("Không thể xác định ID đơn hàng");
        }

        const response = await axios.get(
          `http://localhost:8000/api/orders/${orderId}`
        );
        setOrder(response.data);
      } catch (err) {
        setError("Không thể tải thông tin đơn hàng");
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]); // Sử dụng orderId làm dependency

  if (loading) {
    return (
      <div className="tw-min-h-[80vh] tw-flex tw-items-center tw-justify-center">
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-min-h-[80vh] tw-flex tw-items-center tw-justify-center">
        <p className="tw-text-red-500">{error}</p>
        <Link to="/" className="tw-ml-2 tw-text-blue-500">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <>
      <ClientHeader lightMode={false} />

      <main className="tw-min-h-[80vh] tw-pt-24 container">
        <div className="tw-mt-6 tw-mb-16">
          <div className="tw-flex tw-items-center tw-gap-5">
            <Link to="/" className="tw-text-[#9E9E9E]">
              Trang chủ
            </Link>

            <div className="tw-text-[#9E9E9E]">
              <i className="fa-solid fa-chevron-right"></i>
            </div>

            <Link to="/cart" className="tw-text-[#9E9E9E]">
              Giỏ hàng
            </Link>

            <div className="tw-text-[#9E9E9E]">
              <i className="fa-solid fa-chevron-right"></i>
            </div>

            <p className="tw-text-[#1A1C20] tw-font-bold tw-m-0">Thanh toán</p>
          </div>

          <div className="tw-flex tw-size-24 tw-items-center tw-justify-center tw-bg-[#F2F9F9] tw-rounded-full tw-mx-auto">
            {vnpParams.responseCode === "00" ? (
              <i className="fa-solid fa-check tw-text-[#99CCD0] tw-text-4xl"></i>
            ) : (
              <i className="fa-solid fa-xmark tw-text-red-500 tw-text-4xl"></i>
            )}
          </div>

          <h1 className="tw-text-center tw-font-bold tw-text-[32px] tw-text-[#1A1C20] tw-my-4">
            {vnpParams.responseCode === "00"
              ? "Thanh toán thành công"
              : "Thanh toán không thành công"}
          </h1>

          {vnpParams.responseCode === "00" ? (
            <p className="tw-m-0 tw-text-[#1A1C20] tw-text-center">
              Cảm ơn bạn đã thanh toán đơn hàng qua VNPay. Đơn hàng của bạn đã
              được xác nhận thanh toán thành công. Chúng tôi sẽ liên hệ với bạn
              để xác nhận đơn hàng trong thời gian sớm nhất.
            </p>
          ) : (
            <p className="tw-m-0 tw-text-[#1A1C20] tw-text-center">
              Thanh toán của bạn không thành công. Vui lòng thử lại hoặc chọn
              phương thức thanh toán khác.
            </p>
          )}

          <section className="tw-border tw-border-solid tw-border-[#EEEEEE] tw-rounded tw-p-4 tw-mt-4 tw-flex tw-flex-col tw-items-center">
            <p className="tw-mb-1">
              <span className="tw-text-[#1A1C20]">Mã giao dịch VNPay:</span>
              <span className="tw-text-[#1A1C20] tw-ml-1 tw-font-bold">
                {vnpParams.transactionNo}
              </span>
            </p>

            <p className="tw-mb-1">
              <span className="tw-text-[#1A1C20]">Mã đơn hàng:</span>
              <span className="tw-text-[#1A1C20] tw-ml-1 tw-font-bold">
                {vnpParams.txnRef}
              </span>
            </p>

            <p className="tw-mb-1">
              <span className="tw-text-[#1A1C20]">Thời gian thanh toán:</span>
              <span className="tw-text-[#1A1C20] tw-ml-1 tw-font-bold">
                {formatVnpPayDate(vnpParams.payDate)}
              </span>
            </p>

            <p className="tw-mb-1">
              <span className="tw-text-[#1A1C20]">Ngân hàng:</span>
              <span className="tw-text-[#1A1C20] tw-ml-1 tw-font-bold">
                {vnpParams.bankCode} ({vnpParams.cardType})
              </span>
            </p>

            <p className="tw-mb-1">
              <span className="tw-text-[#1A1C20]">Số tiền:</span>
              <span className="tw-text-[#1A1C20] tw-ml-1 tw-font-bold">
                {formatPrice(formatVnpAmount(vnpParams.amount))}
              </span>
            </p>

            <p className="tw-mb-1">
              <span className="tw-text-[#1A1C20]">Trạng thái:</span>
              <span
                className={`tw-ml-1 tw-font-bold ${
                  vnpParams.responseCode === "00"
                    ? "tw-text-green-500"
                    : "tw-text-red-500"
                }`}
              >
                {vnpParams.responseCode === "00"
                  ? "Thành công"
                  : "Thất bại"}
              </span>
            </p>
          </section>

          {order && (
            <>
              <section className="tw-border tw-border-solid tw-border-[#EEEEEE] tw-rounded tw-p-6 tw-mt-4">
                <p className="tw-text-[#1A1C20] tw-font-bold tw-text-[32px] tw-text-center tw-mb-6">
                  Thông tin đơn hàng
                </p>

                <div className="tw-border tw-border-solid tw-border-[#EEEEEE] tw-rounded tw-px-6 tw-py-3">
                  {order.orderDetails?.map((item) => (
                    <div
                      key={item.CartItemID || item.ProductVariantID}
                      className="tw-flex tw-items-center tw-gap-x-4 tw-border-x-0 tw-border-t-0 tw-py-4 [&:not(:last-child)]:tw-border-b [&:not(:last-child)]:tw-border-solid [&:not(:last-child)]:tw-border-[#EEEEEE]"
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
                        <p className="tw-m-0 tw-font-bold tw-text-xl tw-text-[#1A1C20]">
                          {item.product_variant?.product?.Name ||
                            "Tên sản phẩm không xác định"}
                        </p>

                        {/* Thuộc tính biến thể */}
                        {item.product_variant?.attributes && item.product_variant.attributes.length > 0 && (
                          <div className="attribute-tags tw-mb-2">
                            {item.product_variant.attributes.map((attr, idx) => (
                              <span key={idx} className="attribute-tag">
                                {attr.attribute?.name ? `${attr.attribute.name}: ` : ""}
                                {attr.value}
                                {idx < item.product_variant.attributes.length - 1 && <span> | </span>}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="tw-mt-3 tw-text-[#1A1C20]">
                          SL: {item.Quantity}
                        </p>
                      </div>

                      <p className="tw-ml-auto tw-text-[#1A1C20] tw-text-xl">
                        {formatPrice(
                          (item.product_variant?.Price || 0) * item.Quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="tw-flex tw-items-center tw-justify-between tw-mt-6">
                  <p className="tw-m-0 tw-text-[#1A1C20]">Tổng đơn hàng</p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20]">
                    {formatPrice(order.Total_amount)}
                  </p>
                </div>

                <hr className="tw-my-4 tw-bg-[#EEEEEE] tw-h-[1px] tw-outline-none tw-border-none" />

                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <p className="tw-m-0 tw-text-[#1A1C20]">Phí vận chuyển</p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20]">
                    {formatPrice(0)}
                  </p>
                </div>

                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <p className="tw-m-0 tw-text-[#1A1C20]">
                    Phương thức thanh toán
                  </p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20]">
                    VNPay ({vnpParams.bankCode})
                  </p>
                </div>

                <hr className="tw-my-4 tw-bg-[#EEEEEE] tw-h-[1px] tw-outline-none tw-border-none" />

                <div className="tw-flex tw-items-center tw-justify-between">
                  <p className="tw-m-0 tw-text-[#1A1C20]">Tổng thanh toán</p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20] tw-text-xl">
                    {formatPrice(formatVnpAmount(vnpParams.amount))}
                  </p>
                </div>
              </section>

              <section className="tw-border tw-border-solid tw-border-[#EEEEEE] tw-rounded tw-p-6 tw-mt-4">
                <p className="tw-text-[#1A1C20] tw-font-bold tw-text-[32px] tw-text-center tw-mb-6">
                  Thông tin giao hàng
                </p>

                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <p className="tw-m-0 tw-text-[#1A1C20]">Họ tên người nhận</p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20]">
                    {order.Receiver_name}
                  </p>
                </div>

                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <p className="tw-m-0 tw-text-[#1A1C20]">Số điện thoại</p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20]">
                    {order.Receiver_phone}
                  </p>
                </div>

                <div className="tw-flex tw-items-center tw-justify-between">
                  <p className="tw-m-0 tw-text-[#1A1C20]">Địa chỉ</p>
                  <p className="tw-m-0 tw-font-bold tw-text-[#1A1C20]">
                    {order.Shipping_address}
                  </p>
                </div>
              </section>
            </>
          )}

          <div className="tw-text-center tw-mt-4">
            {vnpParams.responseCode === "00" ? (
              <Link
                to="/products"
                className="tw-font-normal tw-inline-flex tw-items-center"
              >
                <p className="tw-m-0 tw-text-[#1A1C20]">Tiếp tục mua hàng</p>
                <i className="fa-solid fa-chevron-right tw-text-[#1A1C20] tw-ml-2 tw-text-sm"></i>
              </Link>
            ) : (
              <Link
                to={`/checkout?orderId=${vnpParams.txnRef}`}
                className="tw-font-normal tw-inline-flex tw-items-center"
              >
                <p className="tw-m-0 tw-text-[#1A1C20]">Thử lại thanh toán</p>
                <i className="fa-solid fa-chevron-right tw-text-[#1A1C20] tw-ml-2 tw-text-sm"></i>
              </Link>
            )}
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

export default ThankYouPay;
