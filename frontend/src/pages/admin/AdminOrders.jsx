import React, { useState, useEffect } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu mẫu
  const mockOrders = [
    {
      id: 1,
      user_id: 1,
      username: "user1",
      total_amount: 150000,
      status: "pending",
      created_at: "2024-01-15 10:30:00",
      items: [
        { product_name: "Sản phẩm 1", quantity: 2, price: 75000 }
      ]
    },
    {
      id: 2,
      user_id: 2,
      username: "user2",
      total_amount: 300000,
      status: "completed",
      created_at: "2024-01-14 15:20:00",
      items: [
        { product_name: "Sản phẩm 2", quantity: 1, price: 200000 },
        { product_name: "Sản phẩm 3", quantity: 1, price: 100000 }
      ]
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return { background: "#fff3cd", color: "#856404" };
      case "processing": return { background: "#cce5ff", color: "#004085" };
      case "shipped": return { background: "#d1ecf1", color: "#0c5460" };
      case "completed": return { background: "#d4edda", color: "#155724" };
      case "cancelled": return { background: "#f8d7da", color: "#721c24" };
      default: return { background: "#f8f9fa", color: "#6c757d" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "processing": return "Đang xử lý";
      case "shipped": return "Đã gửi hàng";
      case "completed": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Mã đơn hàng</th>
            <th style={{ padding: 12, textAlign: "left" }}>Khách hàng</th>
            <th style={{ padding: 12, textAlign: "left" }}>Tổng tiền</th>
            <th style={{ padding: 12, textAlign: "left" }}>Trạng thái</th>
            <th style={{ padding: 12, textAlign: "left" }}>Ngày đặt</th>
            <th style={{ padding: 12, textAlign: "left" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12 }}>#{order.id}</td>
              <td style={{ padding: 12 }}>{order.username}</td>
              <td style={{ padding: 12 }}>
                {order.total_amount.toLocaleString("vi-VN")} VNĐ
              </td>
              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    ...getStatusColor(order.status),
                  }}
                >
                  {getStatusText(order.status)}
                </span>
              </td>
              <td style={{ padding: 12 }}>{order.created_at}</td>
              <td style={{ padding: 12 }}>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    marginRight: 8,
                  }}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã gửi hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <button
                  onClick={() => {
                    // Hiển thị chi tiết đơn hàng
                    alert(`Chi tiết đơn hàng #${order.id}:\n${order.items.map(item => 
                      `${item.product_name} - SL: ${item.quantity} - Giá: ${item.price.toLocaleString("vi-VN")} VNĐ`
                    ).join('\n')}`);
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;