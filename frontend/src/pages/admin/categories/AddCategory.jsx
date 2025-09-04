import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: "",
        Description: "",
        Image: "",
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);

            setFormData(prev => ({
                ...prev,
                Image: file
            }));

            if (errors.Image) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.Image;
                    return newErrors;
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Name.trim()) {
            newErrors.Name = "Tên danh mục là bắt buộc";
        }
        if (!formData.Image) {
            newErrors.Image = "Vui lòng chọn hình ảnh";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const submitData = new FormData();
            submitData.append('Name', formData.Name);
            submitData.append('Description', formData.Description);
            submitData.append('Image', formData.Image);

            await axios.post(`http://localhost:8000/api/categories`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Thêm danh mục thành công!");
            navigate("/admin/categories");
        } catch (err) {
            console.error("Error adding category:", err);
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: "Lỗi thêm danh mục. Vui lòng thử lại." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Thêm danh mục mới</h2>

            {errors.general && <div style={{ color: "red", marginBottom: "15px" }}>{errors.general}</div>}

            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Tên danh mục:</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: errors.Name ? "1px solid red" : "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                    />
                    {errors.Name && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.Name}</div>}
                </div>

                {/* Description */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Mô tả:</label>
                    <textarea
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            minHeight: "100px"
                        }}
                    />
                </div>

                {/* Image */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Hình ảnh:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: errors.Image ? "1px solid red" : "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                    />
                    {errors.Image && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.Image}</div>}

                    {previewImage && (
                        <div style={{ marginTop: "10px" }}>
                            <p>Xem trước:</p>
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    marginTop: "5px"
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? "Đang thêm..." : "Thêm danh mục"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/categories")}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
