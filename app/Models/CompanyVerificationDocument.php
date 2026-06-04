<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyVerificationDocument extends Model
{
    protected $fillable = ['company_id', 'document_type', 'file_path', 'status', 'note'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
