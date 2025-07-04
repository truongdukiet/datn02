<?php

namespace App\Http\Controllers\Api; // Namespace cho các API controller

use App\Http\Controllers\Controller; // Kế thừa từ Controller cơ bản
use App\Models\News; // Import News Model
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Import JsonResponse để trả về JSON rõ ràng

class NewsApiController extends Controller
{
    /**
     * Display a listing of the news articles.
     * Hiển thị danh sách các bài viết tin tức.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Lấy tất cả các bài viết tin tức có trạng thái 'published'
        // Sắp xếp theo ngày xuất bản (hoặc ngày tạo) mới nhất
        // Phân trang 10 bài viết mỗi trang.
        // Bạn có thể thêm eager loading cho tác giả nếu cần: ->with('author')
        $news = News::where('status', 'published')
                    ->orderBy('published_at', 'desc')
                    ->paginate(10);

        // Trả về dữ liệu tin tức dưới dạng JSON
        return response()->json($news);
    }

    /**
     * Display the specified news article.
     * Hiển thị chi tiết một bài viết tin tức cụ thể.
     *
     * @param  string  $slug The slug of the news article.
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        // Tìm bài viết tin tức theo slug và đảm bảo nó có trạng thái 'published'
        // Nếu không tìm thấy hoặc chưa được xuất bản, sẽ tự động trả về lỗi 404
        // Bạn có thể thêm eager loading cho tác giả nếu cần: ->with('author')
        $news = News::where('slug', $slug)
                    ->where('status', 'published')
                    ->firstOrFail();

        // Trả về dữ liệu tin tức dưới dạng JSON
        return response()->json($news);
    }

    // Bạn có thể thêm các phương thức store, update, destroy tại đây nếu React frontend cần tương tác ghi dữ liệu.
    // Ví dụ về store:
    /*
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            // ... các validation khác
        ]);

        $news = News::create($request->all()); // Cần đảm bảo $fillable trong News model

        return response()->json($news, 201); // Trả về 201 Created
    }
    */
}
