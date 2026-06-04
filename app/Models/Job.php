<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'category_id', 'location_id', 'title', 'slug', 'description',
        'responsibilities', 'requirements', 'benefits', 'salary_min', 'salary_max',
        'salary_currency', 'job_type', 'experience_level', 'deadline', 'status', 'moderation_note', 'is_featured', 'views_count',
    ];

    protected $casts = [
        'deadline' => 'date',
        'is_featured' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->whereDate('deadline', '>=', now()->toDateString())
            ->whereHas('company', fn (Builder $company) => $company
                ->where('is_active', true)
                ->where('verification_status', 'approved'));
    }
}
