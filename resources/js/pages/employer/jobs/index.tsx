import { Form, Head, Link } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function EmployerJobsIndex({ jobs, company }: { jobs: any; company: any }) {
    return (
        <div className="p-6">
            <Head title="Employer jobs" />
            <PageHeader title="Jobs" description={company ? 'Manage your job posts and applicants.' : 'Create a company profile before posting jobs.'} />
            <div className="mb-4 flex flex-wrap gap-2">
                <Button asChild><Link href="/employer/jobs/create">Post job</Link></Button>
                <Button asChild variant="outline"><Link href="/employer/candidates">Search candidates</Link></Button>
            </div>
            <TableShell page={jobs} columns={['Job', 'Status', 'Metrics', 'Actions']} render={(job: any) => (
                <>
                    <td className="px-4 py-3"><div className="font-medium">{job.title}</div><div className="text-muted-foreground">{job.category?.name} - {job.location?.name}</div>{job.moderation_note && <div className="mt-1 text-xs text-amber-700">{job.moderation_note}</div>}</td>
                    <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                    <td className="px-4 py-3"><div>{job.applications_count} applicants</div><div className="text-muted-foreground">{job.views_count ?? 0} views</div></td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-2"><Button asChild size="sm" variant="outline"><Link href={`/employer/jobs/${job.id}/applicants`}>Applicants</Link></Button><Button asChild size="sm" variant="outline"><Link href={`/employer/jobs/${job.id}/edit`}>Edit</Link></Button><Form action={`/employer/jobs/${job.id}/close`} method="patch"><Button size="sm" variant="outline">Close</Button></Form><Form action={`/employer/jobs/${job.id}`} method="delete"><Button size="sm" variant="destructive">Delete</Button></Form></div></td>
                </>
            )} />
        </div>
    );
}
