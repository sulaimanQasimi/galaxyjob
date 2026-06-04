<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    protected $fillable = [
        'scholarship_category_id', 'title', 'slug', 'provider', 'country', 'study_level', 'funding_type', 'language',
        'deadline', 'summary', 'description', 'eligibility', 'benefits',
        'official_url', 'is_featured', 'is_published',
    ];

    protected $casts = [
        'deadline' => 'date',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function category()
    {
        return $this->belongsTo(ScholarshipCategory::class, 'scholarship_category_id');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
