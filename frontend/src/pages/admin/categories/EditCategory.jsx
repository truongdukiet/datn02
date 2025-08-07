import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: "",
        Description: "",
        Image: "",
        Status: "inactive"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/categories/${id}`);
                const category = response.data.data;

                setFormData({
                    Name: category.Name || "",
                    Description: category.Description || "",
                    Image: category.Image || "",
                    Status: category.Status || "inactive"
                });
                setLoading(false);
            } catch (err) {
                setError("Không thể tải danh mục.");
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/api/categories/${id}`, formData);
            alert("Cập nhật thành công!");
            navigate("/admin/categories");
        } catch (err) {
            setError("Lỗi cập nhật danh mục.");
        }
    };

    if (loading) return <p>Đang tải danh mục...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Cập nhật danh mục</h2>
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
                    {/* Đoạn code thêm vào để hiển thị ảnh cũ */}
                    {formData.Image && (
                        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                            <p>Ảnh hiện tại:</p>
                            <img
                                src={`http://localhost:8000/storage/${formData.Image}`}
                                alt={formData.Name}
                                style={{ maxWidth: "150px" }}
                            />
                        </div>
                    )}
                    <input type="text" name="Image" value={formData.Image} onChange={handleChange} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Trạng thái:</label>
                    <select name="Status" value={formData.Status} onChange={handleChange}>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default EditCategory;
