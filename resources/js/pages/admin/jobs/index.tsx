import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function JobsIndex({ jobs }: { jobs: any }) {
    return (
        <div className="p-6">
            <Head title="Jobs" />
            <PageHeader title="Jobs" description="Review and moderate job posts." />
            <div className="mb-4 flex flex-wrap gap-2 text-sm"><a className="text-emerald-700" href="/admin/moderation">Moderation queue</a><a className="text-emerald-700" href="/admin/exports/jobs">Export jobs CSV</a></div>
            <TableShell page={jobs} columns={['Job', 'Company', 'Status', 'Metrics', 'Action']} render={(job: any) => (
                <>
                    <td className="px-4 py-3"><div className="font-medium">{job.title}</div><div className="text-muted-foreground">{job.category?.name} - {job.location?.name}</div>{job.moderation_note && <div className="mt-1 text-xs text-amber-700">{job.moderation_note}</div>}</td>
                    <td className="px-4 py-3">{job.company?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                    <td className="px-4 py-3"><div>{job.applications_count} applicants</div><div className="text-muted-foreground">{job.views_count ?? 0} views</div></td>
                    <td className="px-4 py-3"><Form action={`/admin/jobs/${job.id}`} method="patch" className="grid min-w-56 gap-2"><select name="status" defaultValue={job.status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>active</option><option>rejected</option><option>closed</option></select><select name="is_featured" defaultValue={job.is_featured ? '1' : '0'} className="rounded-md border bg-background px-2 py-1"><option value="0">standard</option><option value="1">featured</option></select><textarea name="moderation_note" placeholder="Feedback note" className="min-h-20 rounded-md border bg-background px-2 py-1 text-sm" defaultValue={job.moderation_note ?? ''} /><Button size="sm">Save</Button></Form></td>
                </>
            )} />
        </div>
    );
}
