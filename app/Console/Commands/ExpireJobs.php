<?php

namespace App\Console\Commands;

use App\Models\Job;
use Illuminate\Console\Command;

class ExpireJobs extends Command
{
    protected $signature = 'jobs:expire';

    protected $description = 'Close active jobs after their deadline passes.';

    public function handle(): int
    {
        $count = Job::where('status', 'active')
            ->whereDate('deadline', '<', now()->toDateString())
            ->update(['status' => 'closed', 'moderation_note' => 'Automatically closed after deadline.']);

        $this->info("Closed {$count} expired jobs.");

        return self::SUCCESS;
    }
}
