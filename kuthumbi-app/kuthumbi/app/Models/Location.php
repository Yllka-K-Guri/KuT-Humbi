<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'country', 'city', 'zone',
        'address', 'latitude', 'longitude',
    ];

    protected $casts = [
        'latitude'  => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function itemPosts()
    {
        return $this->hasMany(ItemPost::class);
    }
}