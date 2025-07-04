<?php

namespace App\Http\Controllers\Admin; // Đảm bảo namespace đúng cho Admin

use App\Http\Controllers\Controller; // Kế thừa từ Controller cơ bản
use App\Models\News; // Import News Model
use Illuminate\Http\Request;
use Illuminate\Support\Str; // Để tạo slug
use Illuminate\Support\Facades\Auth; // Để lấy UserID của tác giả
use Illuminate\Support\Facades\Storage; // Để xử lý file ảnh

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách tất cả các bài viết tin tức.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Lấy tất cả các bài viết tin tức từ database, sắp xếp theo thời gian tạo mới nhất
        $news = News::orderBy('created_at', 'desc')->paginate(10); // Phân trang 10 bài viết mỗi trang

        // Trả về view 'admin.news.index' và truyền dữ liệu tin tức vào
        return view('admin.news.index', compact('news'));
    }

    /**
     * Show the form for creating a new resource.
     * Hiển thị form để tạo một bài viết tin tức mới.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        // Trả về view 'admin.news.create' chứa form thêm mới
        return view('admin.news.create');
    }

    /**
     * Store a newly created resource in storage.
     * Lưu một bài viết tin tức mới vào database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // 1. Validate dữ liệu đầu vào từ request
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Ảnh không bắt buộc, tối đa 2MB
            'status' => 'required|string|in:draft,published', // Trạng thái phải là 'draft' hoặc 'published'
            'published_at' => 'nullable|date', // Ngày xuất bản có thể null
        ]);

        // 2. Xử lý upload ảnh nếu có
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news_images', 'public'); // Lưu ảnh vào thư mục 'storage/app/public/news_images'
        }

        // 3. Tạo slug từ tiêu đề
        $slug = Str::slug($request->title);

        // Đảm bảo slug là duy nhất. Nếu đã tồn tại, thêm số vào cuối.
        $originalSlug = $slug;
        $count = 1;
        while (News::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        // 4. Tạo bài viết tin tức mới trong database
        News::create([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'image' => $imagePath,
            'author_id' => Auth::id(), // Gán UserID của người dùng đang đăng nhập làm tác giả
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? ($request->published_at ?? now()) : null, // Nếu là 'published' thì gán ngày, ngược lại là null
        ]);

        // 5. Chuyển hướng về trang danh sách tin tức với thông báo thành công
        return redirect()->route('admin.news.index')->with('success', 'Bài viết tin tức đã được tạo thành công!');
    }

    /**
     * Display the specified resource.
     * Hiển thị chi tiết một bài viết tin tức cụ thể.
     *
     * @param  \App\Models\News  $news (Sử dụng Route Model Binding)
     * @return \Illuminate\View\View
     */
    public function show(News $news)
    {
        // Trả về view 'admin.news.show' và truyền đối tượng tin tức vào
        return view('admin.news.show', compact('news'));
    }

    /**
     * Show the form for editing the specified resource.
     * Hiển thị form để chỉnh sửa một bài viết tin tức cụ thể.
     *
     * @param  \App\Models\News  $news (Sử dụng Route Model Binding)
     * @return \Illuminate\View\View
     */
    public function edit(News $news)
    {
        // Trả về view 'admin.news.edit' và truyền đối tượng tin tức vào
        return view('admin.news.edit', compact('news'));
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật một bài viết tin tức cụ thể trong database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\News  $news (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, News $news)
    {
        // 1. Validate dữ liệu đầu vào từ request
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Ảnh không bắt buộc, tối đa 2MB
            'status' => 'required|string|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        // 2. Xử lý upload ảnh mới nếu có
        $imagePath = $news->image; // Giữ ảnh cũ nếu không có ảnh mới
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu tồn tại
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }
            $imagePath = $request->file('image')->store('news_images', 'public');
        } elseif ($request->input('clear_image')) { // Xử lý xóa ảnh nếu có checkbox "clear_image"
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }
            $imagePath = null;
        }

        // 3. Tạo slug từ tiêu đề (chỉ cập nhật nếu tiêu đề thay đổi)
        $slug = $news->slug;
        if ($request->title !== $news->title) {
            $slug = Str::slug($request->title);
            $originalSlug = $slug;
            $count = 1;
            while (News::where('slug', $slug)->where('id', '!=', $news->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
        }

        // 4. Cập nhật bài viết tin tức trong database
        $news->update([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'image' => $imagePath,
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? ($request->published_at ?? now()) : null,
        ]);

        // 5. Chuyển hướng về trang danh sách tin tức với thông báo thành công
        return redirect()->route('admin.news.index')->with('success', 'Bài viết tin tức đã được cập nhật thành công!');
    }

    /**
     * Remove the specified resource from storage.
     * Xóa một bài viết tin tức cụ thể khỏi database.
     *
     * @param  \App\Models\News  $news (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(News $news)
    {
        // 1. Xóa ảnh liên quan nếu có
        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }

        // 2. Xóa bài viết tin tức khỏi database
        $news->delete();

        // 3. Chuyển hướng về trang danh sách tin tức với thông báo thành công
        return redirect()->route('admin.news.index')->with('success', 'Bài viết tin tức đã được xóa thành công!');
    }
}
