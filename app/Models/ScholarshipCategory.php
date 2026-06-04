<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScholarshipCategory extends Model
{
    protected $fillable = ['name', 'slug', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function scholarships()
    {
        return $this->hasMany(Scholarship::class);
    }
}
