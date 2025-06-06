<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
        protected $primaryKey = 'categoryid';
        protected $fillable = [
        'name',
        'description',
        'created_at',
        'updated_at',
    ];
}
