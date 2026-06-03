<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobAlert extends Model
{
    protected $fillable = ['user_id', 'keyword', 'category_id', 'location_id', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
