<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product; // Import Model Product
use App\Models\Category; // Import Model Category để lấy danh sách danh mục
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Để xử lý upload file

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các sản phẩm.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Lấy tất cả sản phẩm và phân trang, eager load category để tránh N+1 problem
        $products = Product::with('category')->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    /**
     * Show the form for creating a new resource.
     * Hiển thị form để tạo sản phẩm mới.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        $categories = Category::all(); // Lấy tất cả danh mục để hiển thị trong dropdown
        return view('admin.products.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     * Lưu sản phẩm mới vào cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'CategoryID' => 'required|exists:categories,CategoryID', // CategoryID phải tồn tại trong bảng categories
            'Name' => 'required|string|max:255',
            'Description' => 'nullable|string',
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // File ảnh, tối đa 2MB
            'base_price' => 'required|numeric|min:0',
            'Status' => 'boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('Image')) {
            // Lưu ảnh vào thư mục 'public/products' và lấy đường dẫn
            $imagePath = $request->file('Image')->store('products', 'public');
        }

        Product::create([
            'CategoryID' => $request->CategoryID,
            'Name' => $request->Name,
            'Description' => $request->Description,
            'Image' => $imagePath, // Lưu đường dẫn ảnh
            'base_price' => $request->base_price,
            'Status' => $request->Status ?? 0, // Mặc định là 0 (inactive) nếu không được cung cấp
            'Create_at' => now(),
            'Update_at' => now(),
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Sản phẩm đã được tạo thành công.');
    }

    /**
     * Show the form for editing the specified resource.
     * Hiển thị form để chỉnh sửa sản phẩm đã cho.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\View\View
     */
    public function edit(Product $product)
    {
        $categories = Category::all(); // Lấy tất cả danh mục để hiển thị trong dropdown
        // Laravel sẽ tự động tìm sản phẩm dựa trên ProductID từ URL (Route Model Binding)
        return view('admin.products.edit', compact('product', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật sản phẩm đã cho trong cơ sở dữ liệu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'CategoryID' => 'required|exists:categories,CategoryID',
            'Name' => 'required|string|max:255',
            'Description' => 'nullable|string',
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // File ảnh, tối đa 2MB
            'base_price' => 'required|numeric|min:0',
            'Status' => 'boolean',
        ]);

        // Xử lý cập nhật ảnh
        if ($request->hasFile('Image')) {
            // Xóa ảnh cũ nếu có
            if ($product->Image) {
                Storage::disk('public')->delete($product->Image);
            }
            // Lưu ảnh mới
            $imagePath = $request->file('Image')->store('products', 'public');
            $product->Image = $imagePath;
        }

        $product->CategoryID = $request->CategoryID;
        $product->Name = $request->Name;
        $product->Description = $request->Description;
        $product->base_price = $request->base_price;
        $product->Status = $request->Status ?? 0; // Đảm bảo Status được cập nhật
        $product->Update_at = now(); // Cập nhật thời gian cập nhật

        $product->save(); // Lưu thay đổi vào database

        return redirect()->route('admin.products.index')->with('success', 'Sản phẩm đã được cập nhật thành công.');
    }

    /**
     * Remove the specified resource from storage.
     * Xóa sản phẩm đã cho khỏi cơ sở dữ liệu.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product)
    {
        // Xóa ảnh liên quan nếu có
        if ($product->Image) {
            Storage::disk('public')->delete($product->Image);
        }

        // Bạn có thể thêm logic kiểm tra xem có biến thể sản phẩm (productvariants)
        // hoặc chi tiết đơn hàng (orderdetail) nào liên quan đến sản phẩm này không
        // trước khi cho phép xóa để tránh lỗi khóa ngoại.
        // Ví dụ: if ($product->productVariants()->count() > 0) { ... }

        $product->delete(); // Xóa sản phẩm

        return redirect()->route('admin.products.index')->with('success', 'Sản phẩm đã được xóa thành công.');
    }
}
