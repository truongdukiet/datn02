<?php

namespace App\Http\Controllers\Admin; // Ensure namespace is Admin

use App\Http\Controllers\Controller; // Inherit from the base Controller
use App\Models\News; // Import News Model
use Illuminate\Http\Request;
use Illuminate\Support\Str; // For slug generation
use Illuminate\Support\Facades\Auth; // To get the author's UserID
use Illuminate\Support\Facades\Storage; // For file storage operations
use Illuminate\Validation\ValidationException; // Import ValidationException for API error handling

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách tất cả các bài viết tin tức.
     *
     * GET /api/admin/news
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Retrieve all news articles from the database, ordered by creation time (latest first)
            // You can add pagination, search, and filtering here if needed for API.
            // Example with pagination: $news = News::orderBy('created_at', 'desc')->paginate($request->get('per_page', 10));
            $news = News::orderBy('created_at', 'desc')->get();

            // Return news data as JSON with 200 OK status
            return response()->json($news, 200);
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json(['message' => 'Error fetching news articles.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Lưu một bài viết tin tức mới vào database.
     *
     * POST /api/admin/news
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // 1. Validate incoming data from the request
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Image is optional, max 2MB
                'status' => 'required|string|in:draft,published', // Status must be 'draft' or 'published'
                'published_at' => 'nullable|date', // Publish date can be null
            ]);

            // 2. Handle image upload if present
            $imagePath = null;
            if ($request->hasFile('image')) {
                // Store image in 'storage/app/public/news_images'
                $imagePath = $request->file('image')->store('news_images', 'public');
            }

            // 3. Generate slug from the title
            $slug = Str::slug($validatedData['title']);

            // Ensure slug is unique. If it already exists, append a number.
            $originalSlug = $slug;
            $count = 1;
            while (News::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            // 4. Create a new news article in the database
            $news = News::create([
                'title' => $validatedData['title'],
                'slug' => $slug,
                'content' => $validatedData['content'],
                'image' => $imagePath,
                'author_id' => Auth::id(), // Assign the UserID of the currently logged-in user as author
                'status' => $validatedData['status'],
                // If status is 'published', set published_at to request's date or current time; otherwise, null
                'published_at' => $validatedData['status'] === 'published' ? ($validatedData['published_at'] ?? now()) : null,
            ]);

            // 5. Return the newly created news article as JSON with 201 Created status
            return response()->json($news, 201);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['errors' => $e->errors()], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            // Handle other unexpected errors (e.g., database errors, file storage errors)
            return response()->json(['message' => 'Error creating news article.', 'error' => $e->getMessage()], 500); // 500 Internal Server Error
        }
    }

    /**
     * Display the specified resource.
     * Hiển thị chi tiết một bài viết tin tức cụ thể.
     *
     * GET /api/admin/news/{news}
     *
     * @param  \App\Models\News  $news (Uses Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(News $news)
    {
        // Laravel will automatically find the news article based on its ID/slug from the URL (Route Model Binding).
        // If not found, Laravel will automatically return 404 Not Found.
        return response()->json($news, 200); // Return news article as JSON with 200 OK status
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật một bài viết tin tức cụ thể trong database.
     *
     * PUT/PATCH /api/admin/news/{news}
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\News  $news (Uses Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, News $news)
    {
        try {
            // 1. Validate incoming data from the request
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Image is optional, max 2MB
                'status' => 'required|string|in:draft,published',
                'published_at' => 'nullable|date',
                'clear_image' => 'nullable|boolean', // New field to explicitly clear the image
            ]);

            // 2. Handle new image upload or existing image deletion
            $imagePath = $news->image; // Keep the old image path by default
            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($news->image && Storage::disk('public')->exists($news->image)) {
                    Storage::disk('public')->delete($news->image);
                }
                $imagePath = $request->file('image')->store('news_images', 'public');
            } elseif (isset($validatedData['clear_image']) && $validatedData['clear_image']) {
                // If 'clear_image' is true, delete the existing image
                if ($news->image && Storage::disk('public')->exists($news->image)) {
                    Storage::disk('public')->delete($news->image);
                }
                $imagePath = null;
            }

            // 3. Generate slug from the title (only update if title has changed)
            $slug = $news->slug;
            if ($validatedData['title'] !== $news->title) {
                $slug = Str::slug($validatedData['title']);
                $originalSlug = $slug;
                $count = 1;
                // Ensure the new slug is unique, excluding the current news article
                while (News::where('slug', $slug)->where('id', '!=', $news->id)->exists()) {
                    $slug = $originalSlug . '-' . $count++;
                }
            }

            // 4. Update the news article in the database
            $news->update([
                'title' => $validatedData['title'],
                'slug' => $slug,
                'content' => $validatedData['content'],
                'image' => $imagePath,
                'status' => $validatedData['status'],
                'published_at' => $validatedData['status'] === 'published' ? ($validatedData['published_at'] ?? now()) : null,
            ]);

            // 5. Return the updated news article as JSON with 200 OK status
            return response()->json($news, 200);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Handle other unexpected errors
            return response()->json(['message' => 'Error updating news article.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Xóa một bài viết tin tức cụ thể khỏi database.
     *
     * DELETE /api/admin/news/{news}
     *
     * @param  \App\Models\News  $news (Uses Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(News $news)
    {
        try {
            // 1. Delete associated image if it exists
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }

            // 2. Delete the news article from the database
            $news->delete();

            // 3. Return a success message as JSON with 200 OK status (or 204 No Content)
            return response()->json(['message' => 'News article deleted successfully.'], 200);
            // Alternatively: return response()->noContent(); // 204 No Content
        } catch (\Exception $e) {
            // Handle errors during deletion
            return response()->json(['message' => 'Error deleting news article.', 'error' => $e->getMessage()], 500);
        }
    }

    // The 'create' and 'edit' methods are not needed for an API Controller
    // as they are used to display HTML forms, not return API data.
    // public function create() { ... }
    // public function edit(News $news) { ... }
}
