import React, { useEffect, useState } from 'react';
import { deleteCategory } from '../../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import './AdminCategory.css';

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 

    const API_BASE_URL = 'http://localhost:8000/api';
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/categories`);
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


// ✅ Toggle trạng thái
const handleToggleStatus = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}/toggle-status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();

        if (result.success) {
            setCategories(prev =>
                prev.map(cat =>
                    cat.CategoryID === id
                        ? { ...cat, is_active: result.data.is_active }
                        : cat
                )
            );
        }
    } catch (err) {
        alert("Cập nhật trạng thái thất bại!");
    }
};

// ✅ Hàm xóa
const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
        const response = await deleteCategory(id); 
        const data = response.data; 

        if (data.success) {
            alert(data.message || "Xóa danh mục thành công!");
            setCategories(prev => prev.filter(cat => cat.CategoryID !== id));
        } else {
            alert(data.message || "Không thể xóa danh mục!");
        }
    } catch (err) {
        const msg = err.response?.data?.message || "Lỗi khi xóa danh mục!";
        alert(msg);
        console.error("Delete error:", err.response?.data || err.message);
    }
};



    // ✅ Lọc theo từ khóa
    const filteredCategories = categories.filter((category) => {
        return category.Name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // ✅ Tính toán phân trang
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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
                    {currentCategories.map((category) => (
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
                                <button
                                    className={category.is_active ? "btn-active" : "btn-inactive"}
                                    onClick={() => handleToggleStatus(category.CategoryID)}
                                >
                                    {category.is_active ? "Hiển thị" : "Ẩn"}
                                </button>
                            </td>

                            <td>
                                <Link to={`/admin/edit-category/${category.CategoryID}`} className="btn-edit">Sửa</Link>
                                    <button onClick={() => handleDelete(category.CategoryID)}className="btn-delete"> Xóa
    </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Phân trang */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        « Trước
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Sau »
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminCategory;
