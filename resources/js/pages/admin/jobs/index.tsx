import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function JobsIndex({ jobs }: { jobs: any }) {
    return <div className="p-6"><Head title="Jobs" /><PageHeader title="Jobs" description="Review and moderate job posts." /><TableShell page={jobs} columns={['Job', 'Company', 'Status', 'Applicants', 'Action']} render={(job: any) => <><td className="px-4 py-3"><div className="font-medium">{job.title}</div><div className="text-muted-foreground">{job.category?.name} • {job.location?.name}</div></td><td className="px-4 py-3">{job.company?.name}</td><td className="px-4 py-3"><StatusBadge status={job.status} /></td><td className="px-4 py-3">{job.applications_count}</td><td className="px-4 py-3"><Form action={`/admin/jobs/${job.id}`} method="patch" className="flex gap-2"><select name="status" defaultValue={job.status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>active</option><option>rejected</option><option>closed</option></select><select name="is_featured" defaultValue={job.is_featured ? '1' : '0'} className="rounded-md border bg-background px-2 py-1"><option value="0">standard</option><option value="1">featured</option></select><Button size="sm">Save</Button></Form></td></>} /></div>;
}
