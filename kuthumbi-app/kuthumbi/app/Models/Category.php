<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'name_en', 'icon'];

    public function itemPosts()
    {
        return $this->hasMany(ItemPost::class);
    }
}