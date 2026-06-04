<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'slug', 'logo', 'cover_image', 'industry', 'website',
        'phone', 'email', 'address', 'description', 'verification_status', 'moderation_note', 'company_size', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function reviews()
    {
        return $this->hasMany(CompanyReview::class);
    }

    public function verificationDocuments()
    {
        return $this->hasMany(CompanyVerificationDocument::class);
    }
}
