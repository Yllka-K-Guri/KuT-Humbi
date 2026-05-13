<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ItemPost extends Model
{
    protected $fillable = [
        'user_id', 'post_type', 'category_id', 'location_id',
        'title', 'description', 'incident_date', 'status', 'resolved_at',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'resolved_at'   => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function photos()
    {
        return $this->hasMany(ItemPhoto::class)->orderBy('sort_order');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lostMatches()
    {
        return $this->hasMany(PostMatch::class, 'lost_post_id');
    }

    public function foundMatches()
    {
        return $this->hasMany(PostMatch::class, 'found_post_id');
    }

    public function scopeLost(Builder $query): Builder
    {
        return $query->where('post_type', 'LOST');
    }

    public function scopeFound(Builder $query): Builder
    {
        return $query->where('post_type', 'FOUND');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByCity(Builder $query, string $city): Builder
    {
        return $query->whereHas('location', fn($q) => $q->where('city', $city));
    }

    public function isLost(): bool  { return $this->post_type === 'LOST'; }
    public function isFound(): bool { return $this->post_type === 'FOUND'; }
    public function isActive(): bool { return $this->status === 'ACTIVE'; }

    public function mainPhoto(): ?ItemPhoto
    {
        return $this->photos->first();
    }
}