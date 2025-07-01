<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product; // Đảm bảo bạn đã có model Product để lấy dữ liệu

/**
 * HomeController
 *
 * Controller này quản lý logic cho trang chủ của ứng dụng.
 * Nó sẽ lấy dữ liệu cần thiết từ cơ sở dữ liệu và truyền đến view.
 */
class HomeController extends Controller
{
    /**
     * Hiển thị trang chủ.
     *
     * Phương thức này được gọi khi người dùng truy cập vào đường dẫn gốc (/).
     * Nó lấy một số sản phẩm mới nhất từ cơ sở dữ liệu và truyền chúng đến view 'index'.
     *
     * @return \Illuminate\Contracts\View\View Trả về một Blade view.
     */
    public function index()
    {
        // Lấy 5 sản phẩm mới nhất để hiển thị trên trang chủ.
        // Đảm bảo rằng bạn đã có bảng 'products' và model 'Product' tương ứng.
        $products = Product::orderBy('created_at', 'desc')->take(5)->get();

        // Bạn có thể lấy thêm các dữ liệu khác nếu trang chủ của bạn phức tạp hơn,
        // ví dụ như danh mục, bài viết blog mới nhất, banner, v.v.
        // $categories = Category::all();
        // $latestNews = BlogPost::latest()->take(3)->get();

        // Trả về view 'index.blade.php' và truyền biến 'products' vào view.
        // Trong view, bạn có thể truy cập dữ liệu này thông qua biến $products.
        return view('index', [
            'products' => $products,
            // 'categories' => $categories,
            // 'latestNews' => $latestNews,
        ]);
    }
}

