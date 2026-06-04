<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyMember extends Model
{
    protected $fillable = ['company_id', 'user_id', 'email', 'role', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
