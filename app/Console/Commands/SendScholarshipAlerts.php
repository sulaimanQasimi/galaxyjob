<?php

namespace App\Console\Commands;

use App\Models\Scholarship;
use App\Models\ScholarshipAlert;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendScholarshipAlerts extends Command
{
    protected $signature = 'scholarship-alerts:send';

    protected $description = 'Email users when new scholarships match saved alerts.';

    public function handle(): int
    {
        ScholarshipAlert::with(['user', 'category'])
            ->where('is_active', true)
            ->chunkById(100, function ($alerts) {
                foreach ($alerts as $alert) {
                    $since = $alert->last_sent_at ?? now()->subDay();
                    $scholarships = Scholarship::published()
                        ->where('created_at', '>', $since)
                        ->when($alert->keyword, fn ($query, $keyword) => $query->where(fn ($q) => $q
                            ->where('title', 'like', "%{$keyword}%")
                            ->orWhere('summary', 'like', "%{$keyword}%")))
                        ->when($alert->scholarship_category_id, fn ($query) => $query->where('scholarship_category_id', $alert->scholarship_category_id))
                        ->when($alert->country, fn ($query) => $query->where('country', $alert->country))
                        ->when($alert->study_level, fn ($query) => $query->where('study_level', $alert->study_level))
                        ->when($alert->funding_type, fn ($query) => $query->where('funding_type', $alert->funding_type))
                        ->latest()
                        ->take(10)
                        ->get();

                    if ($scholarships->isEmpty() || ! $alert->user?->email) {
                        continue;
                    }

                    Mail::raw($scholarships->map(fn ($scholarship) => $scholarship->title.' - '.route('scholarships.show', $scholarship))->join("\n"), fn ($mail) => $mail
                        ->to($alert->user->email)
                        ->subject('New Galaxy Jobs scholarship matches'));

                    $alert->update(['last_sent_at' => now()]);
                }
            });

        return self::SUCCESS;
    }
}
