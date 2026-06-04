<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['job_id', 'user_id', 'cv_file', 'cover_letter', 'status'];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function statusUpdates()
    {
        return $this->hasMany(ApplicationStatusUpdate::class);
    }
}
