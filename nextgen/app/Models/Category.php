<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'CategoryID';
    public $timestamps = false;

    protected $fillable = ['Name', 'Description', 'Image', 'Create_at', 'Update_at' ,'is_active'];
    protected $casts = [
    'is_active' => 'boolean',
    ];
    public function products()
    {
        return $this->hasMany(Product::class, 'CategoryID', 'CategoryID');
    }

}
