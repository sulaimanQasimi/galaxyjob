<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeProfile extends Model
{
    protected $fillable = [
        'user_id', 'headline', 'summary', 'phone', 'address', 'experience_years',
        'education', 'expected_salary', 'cv_file',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'employee_profile_skill');
    }
}
