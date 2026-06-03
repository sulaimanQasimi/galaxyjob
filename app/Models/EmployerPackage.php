<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployerPackage extends Model
{
    protected $fillable = [
        'name', 'description', 'job_posts', 'featured_posts', 'price', 'currency',
        'duration_days', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];
}
