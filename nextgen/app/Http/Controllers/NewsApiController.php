<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;

class NewsApiController extends Controller
{
    /**
     * Danh sách bài viết (API cho frontend)
     */
    public function index(Request $request)
    {
        $news = News::where('status', 'published')
                    ->orderBy('published_at', 'desc')
                    ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $news
        ], 200);
    }

    /**
     * Chi tiết bài viết theo slug
     */
    public function show($slug)
    {
        $news = News::where('slug', $slug)
                    ->where('status', 'published')
                    ->first();

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Bài viết không tồn tại hoặc chưa được xuất bản.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $news
        ], 200);
    }
}
