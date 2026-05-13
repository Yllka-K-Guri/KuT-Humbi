<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostMatch extends Model
{
    protected $fillable = [
        'lost_post_id', 'found_post_id', 'match_score', 'status'
    ];

    protected $casts = [
        'match_score' => 'decimal:2',
    ];

    public function lostPost()
    {
        return $this->belongsTo(ItemPost::class, 'lost_post_id');
    }

    public function foundPost()
    {
        return $this->belongsTo(ItemPost::class, 'found_post_id');
    }

    public function scopeHighConfidence($query, float $threshold = 70.0)
    {
        return $query->where('match_score', '>=', $threshold);
    }
}