<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id', 'employer_package_id', 'amount', 'currency', 'status', 'reference', 'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(EmployerPackage::class, 'employer_package_id');
    }

    public function subscription()
    {
        return $this->hasOne(EmployerSubscription::class);
    }
}
