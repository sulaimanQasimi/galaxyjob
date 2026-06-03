<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'country', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
