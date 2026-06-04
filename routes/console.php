<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('job-alerts:send')->hourly();
Schedule::command('scholarship-alerts:send')->hourly();
Schedule::command('jobs:expire')->daily();
Schedule::command('subscriptions:renewal-notices')->daily();
