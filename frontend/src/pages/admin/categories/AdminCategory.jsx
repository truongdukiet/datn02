import React, { useEffect, useState } from 'react';
import { deleteCategory } from '../../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import './AdminCategory.css';

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const API_BASE_URL = 'http://localhost:8000/api';
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const data = await response.json();
            setCategories(data.data || []);
        } catch (err) {
            setError("Lỗi khi lấy danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            try {
                await deleteCategory(id);
                setCategories(prev => prev.filter(category => category.CategoryID !== id));
            } catch (err) {
                alert("Xóa không thành công!");
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/toggle-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                // Gọi lại danh sách thay vì cập nhật local để đảm bảo đồng bộ DB
                fetchCategories();
            } else {
                alert(result.message || "Không thể chuyển đổi trạng thái");
            }
        } catch (error) {
            alert("Lỗi chuyển đổi trạng thái");
        }
    };

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.Name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || category.Status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="admin-category-loading">Đang tải dữ liệu...</div>;
    if (error) return <div className="admin-category-error">Lỗi: {error}</div>;

    return (
        <div className="admin-category-container">
            <div className="admin-category-header">
                <h2>Quản lý danh mục</h2>
                <Link to="/admin/add-category" className="admin-category-add-button">+ Thêm danh mục</Link>
            </div>

            <div className="admin-category-filters">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                </select>
            </div>

            <table className="admin-category-table">
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên danh mục</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map((category) => (
                        <tr key={category.CategoryID}>
                            <td>
                                {category.Image ? (
                                    <img
                                        src={`http://localhost:8000/storage/${category.Image}`}
                                        alt={category.Name}
                                        className="admin-category-table-img"
                                    />
                                ) : (
                                    '—'
                                )}
                            </td>
                            <td>{category.Name}</td>
                            <td>{category.Description}</td>
                            <td>
                                <span
                                    className={`status-tag ${category.Status === 'active' ? 'active' : 'inactive'}`}
                                    onClick={() => handleToggleStatus(category.CategoryID)}
                                    style={{ cursor: 'pointer' }}
                                    title="Nhấn để đổi trạng thái"
                                >
                                    {category.Status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                            </td>
                            <td>
                                <Link to={`/admin/edit-category/${category.CategoryID}`} className="btn-edit">Sửa</Link>
                                <button onClick={() => handleDelete(category.CategoryID)} className="btn-delete">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCategory;
