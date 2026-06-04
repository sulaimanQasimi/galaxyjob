import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function ModerationIndex({ jobs, companies }: { jobs: any; companies: any }) {
    return (
        <div className="grid gap-8 p-6">
            <Head title="Moderation queue" />
            <PageHeader title="Moderation queue" description="Approve or reject pending jobs and companies with clear feedback." />
            <section>
                <h2 className="mb-3 font-semibold">Pending jobs</h2>
                <TableShell page={jobs} columns={['Job', 'Company', 'Status', 'Action']} render={(job: any) => (
                    <>
                        <td className="px-4 py-3"><div className="font-medium">{job.title}</div><div className="text-muted-foreground">{job.category?.name} - {job.location?.name}</div></td>
                        <td className="px-4 py-3">{job.company?.name}</td>
                        <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                        <td className="px-4 py-3"><ModerateJob job={job} /></td>
                    </>
                )} />
            </section>
            <section>
                <h2 className="mb-3 font-semibold">Pending companies</h2>
                <TableShell page={companies} columns={['Company', 'Owner', 'Status', 'Action']} render={(company: any) => (
                    <>
                        <td className="px-4 py-3 font-medium">{company.name}</td>
                        <td className="px-4 py-3">{company.user?.email}</td>
                        <td className="px-4 py-3"><StatusBadge status={company.verification_status} /></td>
                        <td className="px-4 py-3"><ModerateCompany company={company} /></td>
                    </>
                )} />
            </section>
        </div>
    );
}

function ModerateJob({ job }: { job: any }) {
    return <Form action={`/admin/jobs/${job.id}`} method="patch" className="grid min-w-56 gap-2"><select name="status" defaultValue={job.status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>active</option><option>rejected</option><option>closed</option></select><input type="hidden" name="is_featured" value={job.is_featured ? '1' : '0'} /><textarea name="moderation_note" placeholder="Feedback note" className="min-h-20 rounded-md border bg-background px-2 py-1 text-sm" defaultValue={job.moderation_note ?? ''} /><Button size="sm">Save</Button></Form>;
}

function ModerateCompany({ company }: { company: any }) {
    return <Form action={`/admin/companies/${company.id}`} method="patch" className="grid min-w-56 gap-2"><select name="verification_status" defaultValue={company.verification_status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>approved</option><option>rejected</option></select><input type="hidden" name="is_active" value={company.is_active ? '1' : '0'} /><textarea name="moderation_note" placeholder="Feedback note" className="min-h-20 rounded-md border bg-background px-2 py-1 text-sm" defaultValue={company.moderation_note ?? ''} /><Button size="sm">Save</Button></Form>;
}
