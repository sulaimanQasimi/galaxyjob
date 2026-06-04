<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateNote extends Model
{
    protected $fillable = ['company_id', 'user_id', 'author_id', 'note'];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
