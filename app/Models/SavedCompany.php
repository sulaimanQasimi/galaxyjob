<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedCompany extends Model
{
    protected $fillable = ['company_id', 'user_id'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
