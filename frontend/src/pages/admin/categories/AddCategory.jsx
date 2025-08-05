import React, { useState } from 'react';
import { addCategory } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import './AdminCategory.css';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Description', description);
        if (image) formData.append('Image', image);

        try {
            await addCategory(formData); // Không cần thiết phải chỉ định Content-Type
            navigate('/admin/categories');
        } catch (error) {
            console.error("Error adding category:", error);
            // Có thể hiển thị thông báo lỗi cho người dùng ở đây
        }
    };

    return (
        <form className="add-category-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Add Category</h2>
            <input
                className="form-input"
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                className="form-textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                className="form-file-input"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit" className="form-button">Add Category</button>
        </form>
    );
};

export default AddCategory;
