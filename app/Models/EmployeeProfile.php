<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeProfile extends Model
{
    protected $fillable = [
        'user_id', 'public_slug', 'is_public', 'headline', 'summary', 'phone', 'address',
        'experience_years', 'education', 'expected_salary', 'cv_file', 'parsed_cv_data',
        'portfolio_url', 'certifications', 'languages',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'parsed_cv_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'employee_profile_skill');
    }

    public function getRouteKeyName(): string
    {
        return 'public_slug';
    }
}
