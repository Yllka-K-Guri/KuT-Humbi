<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ItemPhoto extends Model
{
    protected $fillable = [
        'item_post_id', 'photo_url', 'file_type', 'sort_order'
    ];

    protected $appends = ['full_url'];

    public function itemPost()
    {
        return $this->belongsTo(ItemPost::class);
    }

    public function getFullUrlAttribute(): string
    {
        return Storage::url($this->photo_url);
    }
}