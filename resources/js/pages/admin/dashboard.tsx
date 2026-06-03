import { Head, Link } from '@inertiajs/react';
import { PageHeader, StatGrid, StatusBadge } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import type { Company, Job } from '@/types/portal';

export default function AdminDashboard({ stats, pendingJobs, pendingCompanies }: { stats: Record<string, number>; pendingJobs: Job[]; pendingCompanies: Company[] }) {
    return (
        <div className="p-6">
            <Head title="Admin dashboard" />
            <PageHeader title="Admin dashboard" description="Platform overview and approval queue." />
            <StatGrid stats={stats} />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Panel title="Pending jobs" href="/admin/jobs">{pendingJobs.map((job) => <Row key={job.id} title={job.title} meta={job.company?.name} status={job.status} />)}</Panel>
                <Panel title="Pending companies" href="/admin/companies">{pendingCompanies.map((company) => <Row key={company.id} title={company.name} meta={company.user?.email} status={company.verification_status} />)}</Panel>
            </div>
        </div>
    );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
    return <section className="rounded-lg border bg-card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{title}</h2><Button asChild size="sm" variant="outline"><Link href={href}>Manage</Link></Button></div><div className="grid gap-3">{children}</div></section>;
}

function Row({ title, meta, status }: { title: string; meta?: string; status: string }) {
    return <div className="flex items-center justify-between rounded-md border p-3"><div><div className="font-medium">{title}</div><div className="text-sm text-muted-foreground">{meta}</div></div><StatusBadge status={status} /></div>;
}
