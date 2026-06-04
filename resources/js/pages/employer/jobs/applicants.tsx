import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import type { Job } from '@/types/portal';

export default function Applicants({ job, applications }: { job: Job; applications: any }) {
    return (
        <div className="p-6">
            <Head title={`Applicants - ${job.title}`} />
            <PageHeader title={job.title} description="Review applicant profile details and update hiring status." />
            <TableShell page={applications} columns={['Applicant', 'Profile', 'Pipeline', 'Action']} render={(app: any) => (
                <>
                    <td className="px-4 py-3"><div className="font-medium">{app.user?.name}</div><div className="text-muted-foreground">{app.user?.email}</div></td>
                    <td className="px-4 py-3"><div>{app.user?.employee_profile?.headline}</div><div className="text-muted-foreground">{app.user?.employee_profile?.experience_years ?? 0} years experience</div>{app.cv_file && <a className="text-emerald-700" href={`/storage/${app.cv_file}`}>CV</a>}<div className="mt-1 text-xs text-muted-foreground">{app.user?.employee_profile?.skills?.map((skill: any) => skill.name).join(', ')}</div></td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /><div className="mt-2 grid gap-1 text-xs text-muted-foreground">{(app.status_updates ?? []).map((update: any) => <div key={update.id}>{update.status}{update.note ? ` - ${update.note}` : ''}{update.interview_at ? ` - Interview: ${update.interview_at}` : ''}</div>)}</div></td>
                    <td className="px-4 py-3">
                        <Form action={`/employer/applications/${app.id}`} method="patch" className="grid min-w-56 gap-2">
                            <select name="status" defaultValue={app.status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>reviewed</option><option>shortlisted</option><option>rejected</option><option>hired</option></select>
                            <input name="interview_at" type="datetime-local" className="rounded-md border bg-background px-2 py-1 text-sm" />
                            <textarea name="note" placeholder="Pipeline note" className="min-h-20 rounded-md border bg-background px-2 py-1 text-sm" />
                            <Button size="sm">Save</Button>
                        </Form>
                    </td>
                </>
            )} />
        </div>
    );
}
