<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Import BelongsTo
use App\Models\User; // Import User model cho mối quan hệ

class News extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'news'; // Đảm bảo model liên kết với bảng 'news'

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'image',
        'author_id',
        'status',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'published_at' => 'datetime', // Tự động cast 'published_at' sang đối tượng Carbon
    ];

    /**
     * Get the user that owns the news.
     * Định nghĩa mối quan hệ "thuộc về" với model User.
     * Một tin tức thuộc về một người dùng (tác giả).
     *
     * @return BelongsTo
     */
    public function author(): BelongsTo
    {
        // Giả định UserID trong bảng 'users' là khóa chính và liên kết với 'author_id'
        // 'author_id' là khóa ngoại trong bảng 'news'
        // 'UserID' là khóa chính trong bảng 'users'
        return $this->belongsTo(User::class, 'author_id', 'UserID');
    }
}
