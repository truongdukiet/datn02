import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Button,
  Descriptions,
  Input,
  message,
  Space,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient'; // ✅ Đổi sang axiosClient

const defaultUserData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0987654321',
  address: 'Số 123, Đường ABC, TP. HCM',
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);

  // ✅ Lấy dữ liệu từ API hoặc localStorage
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const storedProfile = localStorage.getItem('userProfile');

    if (loggedUser) {
      axiosClient
        .get(`/users/profile/${loggedUser.UserID}`)
        .then((response) => {
          if (response.data.success) {
            const user = response.data.data;
            setUserData({
              name: user.Fullname || defaultUserData.name,
              email: user.Email || defaultUserData.email,
              phone: user.Phone || defaultUserData.phone,
              address: user.Address || defaultUserData.address,
            });
          }
        })
        .catch(() => {
          console.warn('API không phản hồi. Dùng dữ liệu localStorage.');
          if (storedProfile) {
            setUserData(JSON.parse(storedProfile));
          }
        });
    } else if (storedProfile) {
      setUserData(JSON.parse(storedProfile));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser) {
      message.error('Bạn chưa đăng nhập!');
      return;
    }

    try {
      await axiosClient.put(`/users/${loggedUser.UserID}`, {
        Fullname: userData.name,
        Email: userData.email,
        Phone: userData.phone,
        Address: userData.address,
      });

      localStorage.setItem('userProfile', JSON.stringify(userData));
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('API không phản hồi hoặc lỗi:', error);
      localStorage.setItem('userProfile', JSON.stringify(userData));
      setIsEditing(false);
      message.warning('Không thể kết nối API, thông tin được lưu tạm thời!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    message.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '24px' }}>
      <Card
        title="Thông tin tài khoản"
        style={{ borderRadius: '8px' }}
        extra={
          <Space>
            <Button
              type={isEditing ? 'primary' : 'default'}
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? 'Lưu' : 'Chỉnh Sửa'}
            </Button>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng Xuất
            </Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            style={{ marginBottom: '16px' }}
          />
          <h2>{userData.name}</h2>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ và tên">
            {isEditing ? (
              <Input
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            ) : (
              userData.name
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {isEditing ? (
              <Input
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            ) : (
              userData.email
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {isEditing ? (
              <Input
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
              />
            ) : (
              userData.phone
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {isEditing ? (
              <Input
                name="address"
                value={userData.address}
                onChange={handleInputChange}
              />
            ) : (
              userData.address
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
