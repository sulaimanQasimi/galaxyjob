<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScholarshipAlert extends Model
{
    protected $fillable = [
        'user_id', 'scholarship_category_id', 'keyword', 'country', 'study_level',
        'funding_type', 'is_active', 'last_sent_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_sent_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(ScholarshipCategory::class, 'scholarship_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
