import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function EmployeeApplications({ applications }: { applications: any }) {
    return (
        <div className="p-6">
            <Head title="My applications" />
            <PageHeader title="My applications" />
            <TableShell page={applications} columns={['Job', 'Company', 'Pipeline', 'Action']} render={(app: any) => (
                <>
                    <td className="px-4 py-3 font-medium">{app.job?.title}</td>
                    <td className="px-4 py-3">{app.job?.company?.name}</td>
                    <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                            {(app.status_updates ?? []).map((update: any) => <div key={update.id}>{update.status}{update.note ? ` - ${update.note}` : ''}{update.interview_at ? ` - Interview: ${update.interview_at}` : ''}</div>)}
                        </div>
                    </td>
                    <td className="px-4 py-3"><Form action={`/employee/applications/${app.id}`} method="delete"><Button variant="outline" size="sm">Withdraw</Button></Form></td>
                </>
            )} />
        </div>
    );
}
