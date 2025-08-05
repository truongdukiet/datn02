import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Descriptions, Input, message, Spin } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import axiosClient from "../../../api/axiosClient";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get("/me");
        if (data.success) {
          setUserData(data.user);
          setFormData({
            name: data.user.Fullname || "",
            email: data.user.Email || "",
            phone: data.user.Phone || "",
            address: data.user.Address || "",
          });
        } else {
          message.error("Không thể tải thông tin người dùng");
        }
      } catch {
        message.error("Lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      message.error("Họ tên và Email không được để trống");
      return;
    }
    setLoading(true);
    try {
      await axiosClient.put(`/users/${userData.UserID}`, {
        Fullname: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Address: formData.address,
      });
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      message.success("Cập nhật thông tin thành công!");
    } catch {
      message.error("Cập nhật thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" style={{ marginTop: 50, textAlign: "center" }} />;

  if (!userData) return <div>Không thể tải dữ liệu người dùng</div>;

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: "0 15px" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Avatar size={100} icon={<UserOutlined />} />
          <h2>{userData.Fullname}</h2>
        </div>

        <Descriptions column={1} bordered>
          <Descriptions.Item label="Họ và tên">
            {isEditing ? (
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            ) : (
              userData.Fullname
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {isEditing ? (
              <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            ) : (
              userData.Email
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {isEditing ? (
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            ) : (
              userData.Phone
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {isEditing ? (
              <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            ) : (
              userData.Address
            )}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {isEditing ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu thay đổi</Button>
          ) : (
            <Button type="default" icon={<EditOutlined />} onClick={handleEdit}>Chỉnh sửa</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
