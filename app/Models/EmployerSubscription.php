<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class EmployerSubscription extends Model
{
    protected $fillable = [
        'user_id', 'employer_package_id', 'payment_id', 'starts_at', 'ends_at',
        'job_posts_used', 'featured_posts_used', 'is_active',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function package()
    {
        return $this->belongsTo(EmployerPackage::class, 'employer_package_id');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUsable(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now());
    }

    public function remainingJobPosts(): int
    {
        return max(0, ($this->package?->job_posts ?? 0) - $this->job_posts_used);
    }

    public function remainingFeaturedPosts(): int
    {
        return max(0, ($this->package?->featured_posts ?? 0) - $this->featured_posts_used);
    }
}
