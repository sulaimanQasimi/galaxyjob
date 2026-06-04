<?php

namespace App\Console\Commands;

use App\Models\EmployerSubscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionRenewalNotices extends Command
{
    protected $signature = 'subscriptions:renewal-notices';

    protected $description = 'Notify employers when packages are low or close to expiry.';

    public function handle(): int
    {
        EmployerSubscription::with(['user', 'package'])
            ->usable()
            ->where(fn ($query) => $query->where('ends_at', '<=', now()->addDays(7))->orWhereRaw('job_posts_used >= 0'))
            ->chunkById(100, function ($subscriptions) {
                foreach ($subscriptions as $subscription) {
                    if (! $subscription->user?->email) {
                        continue;
                    }

                    $remaining = $subscription->remainingJobPosts();
                    if ($remaining > 1 && $subscription->ends_at->isAfter(now()->addDays(7))) {
                        continue;
                    }

                    Mail::raw(
                        "Your {$subscription->package?->name} package has {$remaining} job posts remaining and expires on {$subscription->ends_at->toDateString()}.",
                        fn ($mail) => $mail->to($subscription->user->email)->subject('Galaxy Jobs package renewal reminder')
                    );
                }
            });

        return self::SUCCESS;
    }
}
