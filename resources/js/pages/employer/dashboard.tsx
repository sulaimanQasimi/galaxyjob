import { Head, Link } from '@inertiajs/react';
import { PageHeader, StatGrid, StatusBadge } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import type { Company, Job } from '@/types/portal';

export default function EmployerDashboard({ company, stats, recentJobs }: { company?: Company; stats: Record<string, number>; recentJobs: Job[] }) {
    return <div className="p-6"><Head title="Employer dashboard" /><PageHeader title="Employer dashboard" description={company ? `${company.name} is ${company.verification_status}.` : 'Create your company profile to start posting jobs.'} />{!company && <Button asChild className="mb-6"><Link href="/employer/company/edit">Create company profile</Link></Button>}<StatGrid stats={stats} /><section className="mt-6 rounded-lg border bg-card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Recent jobs</h2><Button asChild size="sm"><Link href="/employer/jobs/create">Post job</Link></Button></div><div className="grid gap-3">{recentJobs.length ? recentJobs.map((job) => <div key={job.id} className="flex items-center justify-between rounded-md border p-3"><div><div className="font-medium">{job.title}</div><div className="text-sm text-muted-foreground">{job.applications_count ?? 0} applicants</div></div><StatusBadge status={job.status} /></div>) : <p className="text-muted-foreground">No jobs posted yet.</p>}</div></section></div>;
}
