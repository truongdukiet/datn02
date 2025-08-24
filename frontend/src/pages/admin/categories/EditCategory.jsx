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
        Status: "active"
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/categories/${id}`);
                const category = response.data.data;

                setFormData({
                    Name: category.Name || "",
                    Description: category.Description || "",
                    Image: category.Image || "",
                    Status: category.Status || "active"
                });

                // Lưu ảnh hiện tại để hiển thị
                if (category.Image) {
                    setCurrentImage(`http://localhost:8000/storage/${category.Image}`);
                }

                setLoading(false);
            } catch (err) {
                setErrors({ general: "Không thể tải danh mục." });
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

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo URL để xem trước ảnh
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);

            // Chuẩn bị file để upload (trong FormData)
            setFormData(prev => ({
                ...prev,
                Image: file
            }));

            // Clear error nếu có
            if (errors.Image) {
                setErrors(prev => {
                    const newErrors = {...prev};
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            // Tạo FormData để gửi file
            const submitData = new FormData();
            submitData.append('Name', formData.Name);
            submitData.append('Description', formData.Description);
            submitData.append('Status', formData.Status);

            // Chỉ append Image nếu nó là file (người dùng đã chọn ảnh mới)
            if (formData.Image instanceof File) {
                submitData.append('Image', formData.Image);
            } else {
                submitData.append('Image', formData.Image);
            }

            // Sử dụng phương thức POST với _method=PUT để hỗ trợ upload file
            submitData.append('_method', 'PUT');

            await axios.post(`http://localhost:8000/api/categories/${id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Cập nhật danh mục thành công!");
            navigate("/admin/categories");
        } catch (err) {
            console.error("Error updating category:", err);

            if (err.response?.status === 422 && err.response.data?.errors) {
                // Hiển thị lỗi validation từ server
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: "Lỗi cập nhật danh mục. Vui lòng thử lại." });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>Đang tải danh mục...</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Cập nhật danh mục</h2>

            {errors.general && <div style={{ color: "red", marginBottom: "15px" }}>{errors.general}</div>}

            <form onSubmit={handleSubmit}>
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

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Hình ảnh:</label>

                    {/* Hiển thị ảnh hiện tại */}
                    {currentImage && (
                        <div style={{ marginBottom: "10px" }}>
                            <p>Ảnh hiện tại:</p>
                            <img
                                src={currentImage}
                                alt="Current"
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
                    <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
                        Chỉ chọn file mới nếu muốn thay đổi ảnh hiện tại
                    </div>
                    {errors.Image && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.Image}</div>}

                    {/* Hiển thị ảnh xem trước nếu có */}
                    {previewImage && (
                        <div style={{ marginTop: "10px" }}>
                            <p>Ảnh mới (xem trước):</p>
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

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Trạng thái:</label>
                    <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                    >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: submitting ? "not-allowed" : "pointer",
                            opacity: submitting ? 0.6 : 1
                        }}
                    >
                        {submitting ? "Đang cập nhật..." : "Cập nhật"}
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

export default EditCategory;
