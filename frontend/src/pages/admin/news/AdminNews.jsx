import React, { useState, useEffect } from 'react';
import { updateNews, addNews, deleteNews } from '../../../api/api';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        status: 'published',
        published_at: '',
        author_id: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const API_URL = 'http://localhost:8000/api/news';

    const fetchNews = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (response.ok && data.success) {
                setNews(data.data.data);
            } else {
                setError('Không thể tải danh sách bài viết');
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách bài viết:', err);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // HOÀN NGUYÊN: Hàm handleChange trở về dạng ban đầu của bạn
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ----- PHẦN ĐÃ CHỈNH SỬA CHỈ CHO CHỨC NĂNG THÊM (VÀ SỬA) -----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Tạo một bản sao của formData để làm sạch dữ liệu trước khi gửi API
        const dataToSend = { ...formData };

        // Xử lý các trường có thể chấp nhận null ở backend
        // Nếu trường là chuỗi rỗng, chuyển thành null
        if (dataToSend.author_id === '') {
            dataToSend.author_id = null;
        } else {
            // Đảm bảo author_id là số nguyên nếu có giá trị
            dataToSend.author_id = parseInt(dataToSend.author_id, 10);
            if (isNaN(dataToSend.author_id)) {
                // Nếu không thể chuyển đổi thành số, gán null hoặc xử lý lỗi khác
                dataToSend.author_id = null;
                // Có thể thêm setError ở đây nếu bạn muốn báo lỗi ngay lập tức cho người dùng
                // setError('ID tác giả phải là một số hợp lệ.');
                // return; // Ngừng hàm nếu dữ liệu không hợp lệ
            }
        }

        if (dataToSend.published_at === '') {
            dataToSend.published_at = null;
        }
        if (dataToSend.image === '') {
            dataToSend.image = null;
        }

        console.log('Dữ liệu đang gửi (sau xử lý):', dataToSend);

        try {
            if (editingNews) {
                // Sử dụng dataToSend đã được làm sạch
                await updateNews({ ...dataToSend, id: editingNews.id });
            } else {
                // Sử dụng dataToSend đã được làm sạch cho chức năng thêm
                await addNews(dataToSend);
            }
            setFormData({ title: '', content: '', image: '', status: 'published', published_at: '', author_id: '' }); // Reset form
            setEditingNews(null);
            setShowModal(false);
            fetchNews();
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            let detailedErrorMessage = '';
            if (serverErrors) {
                for (const field in serverErrors) {
                    detailedErrorMessage += `${field}: ${serverErrors[field].join(', ')}\n`;
                }
            } else {
                detailedErrorMessage = err.response?.data?.message || err.message || 'Có gì đó không ổn';
            }
            setError('Lỗi: ' + detailedErrorMessage);
            console.error('Lỗi chi tiết từ server:', err.response?.data || err);
        }
    };
    // -----------------------------------------------------------------

    const openAddModal = () => {
        setEditingNews(null);
        setFormData({ title: '', content: '', image: '', status: 'published', published_at: '', author_id: '' });
        setShowModal(true);
    };

    const openEditModal = (newsItem) => {
        setEditingNews(newsItem);
        setFormData({
            title: newsItem.title,
            content: newsItem.content,
            image: newsItem.image,
            status: newsItem.status,
            published_at: newsItem.published_at ? newsItem.published_at.split('T')[0] : '',
            author_id: newsItem.author_id,
        });
        setShowModal(true);
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                await deleteNews(id);
                fetchNews();
            } catch (err) {
                setError('Lỗi: ' + (err.message || 'Không thể xóa'));
            }
        }
    };

    const filteredNews = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.id.toString().includes(searchTerm);

        const matchesStatus = filterStatus ? item.status === filterStatus : true;

        return matchesSearch && matchesStatus;
    });

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2>Quản lý bài viết</h2>
            <button onClick={openAddModal} style={{ marginBottom: '20px' }}>
                Thêm bài viết
            </button>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề, nội dung, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Nháp</option>
                </select>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        width: '500px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}>
                        <h3>{editingNews ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h3>

                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Tên bài viết *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Nội dung *</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Hình ảnh (URL)</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Trạng thái</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="published">Đã xuất bản</option>
                                    <option value="draft">Nháp</option>
                                </select>
                            </div>
                            <div>
                                <label>Ngày xuất bản</label>
                                <input
                                    type="date"
                                    name="published_at"
                                    value={formData.published_at}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>ID tác giả *</label>
                                <input
                                    type="text"
                                    name="author_id"
                                    value={formData.author_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit">{editingNews ? 'Cập nhật' : 'Thêm'}</button>
                            <button type="button" onClick={() => setShowModal(false)}>Hủy</button>
                        </form>
                    </div>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Nội dung</th>
                        <th>Hình ảnh</th>
                        <th>Trạng thái</th>
                        <th>Ngày xuất bản</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNews.length > 0 ? (
                        filteredNews.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.content}</td>
                                <td>
                                    <img src={item.image} alt={item.title} style={{ width: '100px' }} />
                                </td>
                                <td>{item.status}</td>
                                <td>{new Date(item.published_at).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <button onClick={() => openEditModal(item)}>Sửa</button>
                                    <button onClick={() => handleDeleteNews(item.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy bài viết nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminNews;
