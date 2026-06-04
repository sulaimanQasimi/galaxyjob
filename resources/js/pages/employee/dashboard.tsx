import { Head, Link } from '@inertiajs/react';
import { PageHeader, StatGrid, StatusBadge } from '@/components/portal/admin-table';
import JobCard from '@/components/portal/job-card';
import { Button } from '@/components/ui/button';
import type { Application, Job } from '@/types/portal';

export default function EmployeeDashboard({ profile, profileCompleteness, stats, applications, recommendedJobs }: { profile: any; profileCompleteness: { score: number; missing: string[] }; stats: Record<string, number>; applications: Application[]; recommendedJobs: Job[] }) {
    return (
        <div className="p-6">
            <Head title="Employee dashboard" />
            <PageHeader title="Employee dashboard" description={profile?.headline ?? 'Complete your profile to improve applications.'} />
            <Button asChild className="mb-6"><Link href="/employee/profile/edit">Edit profile</Link></Button>
            <StatGrid stats={stats} />
            <section className="mt-6 rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-semibold">Profile strength</h2>
                    <span className="text-sm font-medium">{profileCompleteness.score}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${profileCompleteness.score}%` }} /></div>
                {profileCompleteness.missing.length > 0 && <p className="mt-3 text-sm text-muted-foreground">{profileCompleteness.missing.slice(0, 3).join(', ')}</p>}
            </section>
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-5">
                    <h2 className="mb-4 font-semibold">Recent applications</h2>
                    <div className="grid gap-3">{applications.map((app) => <div key={app.id} className="flex items-center justify-between rounded-md border p-3"><div>{app.job?.title}<div className="text-sm text-muted-foreground">{app.job?.company?.name}</div></div><StatusBadge status={app.status} /></div>)}</div>
                </div>
                <div className="grid gap-3">
                    <h2 className="font-semibold">Recommended jobs</h2>
                    {recommendedJobs.slice(0, 4).map((job) => <div key={job.id} className="grid gap-2"><JobCard job={job} /><div className="rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">{job.match_score ?? 0}% match</span>{job.match_reasons?.length ? ` - ${job.match_reasons.join(' - ')}` : ''}</div></div>)}
                </div>
            </section>
        </div>
    );
}
