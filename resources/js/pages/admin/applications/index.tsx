import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function ApplicationsIndex({ applications }: { applications: any }) {
    return <div className="p-6"><Head title="Applications" /><PageHeader title="Applications" description="Track applications across the platform." /><TableShell page={applications} columns={['Applicant', 'Job', 'Status', 'Action']} render={(app: any) => <><td className="px-4 py-3">{app.user?.name}<div className="text-muted-foreground">{app.user?.email}</div></td><td className="px-4 py-3">{app.job?.title}<div className="text-muted-foreground">{app.job?.company?.name}</div></td><td className="px-4 py-3"><StatusBadge status={app.status} /></td><td className="px-4 py-3"><Form action={`/admin/applications/${app.id}`} method="patch" className="flex gap-2"><select name="status" defaultValue={app.status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>reviewed</option><option>shortlisted</option><option>rejected</option><option>hired</option></select><Button size="sm">Save</Button></Form></td></>} /></div>;
}
