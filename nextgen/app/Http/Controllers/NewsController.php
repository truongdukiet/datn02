<?php

namespace App\Http\Controllers; // Namespace cho các controller frontend

use App\Models\News; // Import News Model
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Display a listing of the news articles for the public.
     * Hiển thị danh sách các bài viết tin tức cho người dùng cuối.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Lấy tất cả các bài viết tin tức có trạng thái 'published'
        // Sắp xếp theo ngày xuất bản (hoặc ngày tạo) mới nhất
        // Phân trang để tránh tải quá nhiều dữ liệu cùng lúc
        $news = News::where('status', 'published')
                    ->orderBy('published_at', 'desc')
                    ->paginate(10); // Ví dụ: 10 bài viết mỗi trang

        // Trả về view 'news.index' và truyền dữ liệu tin tức vào
        return view('news.index', compact('news'));
    }

    /**
     * Display the specified news article for the public.
     * Hiển thị chi tiết một bài viết tin tức cụ thể cho người dùng cuối.
     *
     * @param  string  $slug The slug of the news article.
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show(string $slug)
    {
        // Tìm bài viết tin tức theo slug và đảm bảo nó có trạng thái 'published'
        // Nếu không tìm thấy hoặc chưa được xuất bản, sẽ tự động trả về lỗi 404
        $news = News::where('slug', $slug)
                    ->where('status', 'published')
                    ->firstOrFail();

        // Trả về view 'news.show' và truyền đối tượng tin tức vào
        return view('news.show', compact('news'));
    }
}
