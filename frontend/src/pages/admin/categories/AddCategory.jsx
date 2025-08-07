import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: "",
        Description: "",
        Image: "",
        Status: "active"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post(`http://localhost:8000/api/categories`, formData);
            alert("Thêm danh mục thành công!");
            navigate("/admin/categories");
        } catch (err) {
            console.error("Error adding category:", err);
            setError("Lỗi thêm danh mục.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Thêm danh mục mới</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Tên danh mục:</label>
                    <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Mô tả:</label>
                    <textarea name="Description" value={formData.Description} onChange={handleChange} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Hình ảnh:</label>
                    <input type="text" name="Image" value={formData.Image} onChange={handleChange} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Trạng thái:</label>
                    <select name="Status" value={formData.Status} onChange={handleChange}>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Đang thêm..." : "Thêm danh mục"}
                </button>
            </form>
        </div>
    );
};

export default AddCategory;
