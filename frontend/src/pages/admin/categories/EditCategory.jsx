import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../../api/api';
import './AdminCategory.css';

const EditCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Image: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategory = async () => {
            try {
                // ✅ Lấy toàn bộ danh mục
                const response = await fetchCategories();
                const allCategories = response.data.data || [];
                const cat = allCategories.find(c => c.CategoryID === parseInt(id));

                if (cat) {
                    setCategory(cat);
                    setFormData({
                        Name: cat.Name,
                        Description: cat.Description,
                        Image: cat.Image || '',
                    });
                } else {
                    alert('Không tìm thấy danh mục!');
                    navigate('/admin/categories');
                }
            } catch (error) {
                console.error("Error loading category:", error);
            }
        };
        loadCategory();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const filePath = `categories/${file.name}`;
            setFormData(prev => ({ ...prev, Image: filePath }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            Name: formData.Name,
            Description: formData.Description,
            Image: formData.Image || category.Image,
        };

        try {
            await axios.put(`http://localhost:8000/api/categories/${id}`, data);
            alert('Cập nhật danh mục thành công!');
            navigate('/admin/categories');
        } catch (error) {
            console.error("Error updating category:", error.response?.data || error.message);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    if (!category) return <div>Loading...</div>;

    return (
        <form className="edit-category-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Sửa Danh Mục</h2>
            <input
                className="form-input"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Category Name"
                required
            />
            <textarea
                className="form-textarea"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                placeholder="Description"
            />
            <input
                className="form-file-input"
                type="file"
                accept="image/jpeg,image/png,image/jpg,gif"
                onChange={handleFileChange}
            />
            {category.Image && (
                <div className="current-image">
                    <img
                        src={`http://localhost:8000/storage/${category.Image}`}
                        alt={category.Name}
                        className="image-preview"
                    />
                    <p>Hình ảnh hiện tại</p>
                </div>
            )}
            <button type="submit" className="form-button">Cập nhật danh mục</button>
        </form>
    );
};

export default EditCategory;
