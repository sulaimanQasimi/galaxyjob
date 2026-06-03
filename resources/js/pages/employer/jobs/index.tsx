import { Form, Head, Link } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function EmployerJobsIndex({ jobs, company }: { jobs: any; company: any }) {
    return <div className="p-6"><Head title="Employer jobs" /><PageHeader title="Jobs" description={company ? 'Manage your job posts and applicants.' : 'Create a company profile before posting jobs.'} /><Button asChild className="mb-4"><Link href="/employer/jobs/create">Post job</Link></Button><TableShell page={jobs} columns={['Job', 'Status', 'Applicants', 'Actions']} render={(job: any) => <><td className="px-4 py-3"><div className="font-medium">{job.title}</div><div className="text-muted-foreground">{job.category?.name} • {job.location?.name}</div></td><td className="px-4 py-3"><StatusBadge status={job.status} /></td><td className="px-4 py-3">{job.applications_count}</td><td className="px-4 py-3"><div className="flex gap-2"><Button asChild size="sm" variant="outline"><Link href={`/employer/jobs/${job.id}/applicants`}>Applicants</Link></Button><Button asChild size="sm" variant="outline"><Link href={`/employer/jobs/${job.id}/edit`}>Edit</Link></Button><Form action={`/employer/jobs/${job.id}`} method="delete"><Button size="sm" variant="destructive">Delete</Button></Form></div></td></>} /></div>;
}
