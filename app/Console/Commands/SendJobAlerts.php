<?php

namespace App\Console\Commands;

use App\Models\Job;
use App\Models\JobAlert;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendJobAlerts extends Command
{
    protected $signature = 'job-alerts:send';

    protected $description = 'Email job seekers when new jobs match their saved alerts.';

    public function handle(): int
    {
        JobAlert::with(['user', 'category', 'location'])
            ->where('is_active', true)
            ->chunkById(100, function ($alerts) {
                foreach ($alerts as $alert) {
                    $since = $alert->last_sent_at ?? now()->subDay();
                    $jobs = Job::with(['company', 'category', 'location'])
                        ->public()
                        ->where('created_at', '>', $since)
                        ->when($alert->keyword, fn ($query, $keyword) => $query->where(fn ($q) => $q
                            ->where('title', 'like', "%{$keyword}%")
                            ->orWhere('description', 'like', "%{$keyword}%")))
                        ->when($alert->category_id, fn ($query) => $query->where('category_id', $alert->category_id))
                        ->when($alert->location_id, fn ($query) => $query->where('location_id', $alert->location_id))
                        ->latest()
                        ->take(10)
                        ->get();

                    if ($jobs->isEmpty() || ! $alert->user?->email) {
                        continue;
                    }

                    Mail::raw($this->messageBody($alert, $jobs), fn ($mail) => $mail
                        ->to($alert->user->email)
                        ->subject('New Galaxy Jobs matches for your alert'));

                    $alert->update(['last_sent_at' => now()]);
                    $this->info("Sent {$jobs->count()} jobs to {$alert->user->email}");
                }
            });

        return self::SUCCESS;
    }

    private function messageBody(JobAlert $alert, $jobs): string
    {
        $lines = [
            'New jobs match your Galaxy Jobs alert.',
            '',
            'Alert: '.collect([$alert->keyword, $alert->category?->name, $alert->location?->name])->filter()->join(' / '),
            '',
        ];

        foreach ($jobs as $job) {
            $lines[] = "{$job->title} - {$job->company?->name} - ".route('jobs.show', $job);
        }

        return implode("\n", $lines);
    }
}
