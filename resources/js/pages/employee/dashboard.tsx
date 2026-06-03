import { Head, Link } from '@inertiajs/react';
import JobCard from '@/components/portal/job-card';
import { PageHeader, StatGrid, StatusBadge } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import type { Application, Job } from '@/types/portal';

export default function EmployeeDashboard({ profile, stats, applications, recommendedJobs }: { profile: any; stats: Record<string, number>; applications: Application[]; recommendedJobs: Job[] }) {
    return <div className="p-6"><Head title="Employee dashboard" /><PageHeader title="Employee dashboard" description={profile?.headline ?? 'Complete your profile to improve applications.'} /><Button asChild className="mb-6"><Link href="/employee/profile/edit">Edit profile</Link></Button><StatGrid stats={stats} /><section className="mt-6 grid gap-6 lg:grid-cols-2"><div className="rounded-lg border bg-card p-5"><h2 className="mb-4 font-semibold">Recent applications</h2><div className="grid gap-3">{applications.map((app) => <div key={app.id} className="flex items-center justify-between rounded-md border p-3"><div>{app.job?.title}<div className="text-sm text-muted-foreground">{app.job?.company?.name}</div></div><StatusBadge status={app.status} /></div>)}</div></div><div className="grid gap-3">{recommendedJobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} />)}</div></section></div>;
}
