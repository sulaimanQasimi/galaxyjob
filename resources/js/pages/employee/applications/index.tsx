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
                    <td className="px-4 py-3">
                        <div className="grid gap-2">
                            <div className="max-h-32 overflow-auto rounded-md border p-2 text-xs text-muted-foreground">{(app.messages ?? []).map((message: any) => <div key={message.id} className="mb-2"><span className="font-medium text-foreground">{message.user?.name}:</span> {message.body}</div>)}</div>
                            <Form action={`/employee/applications/${app.id}/messages`} method="post" className="grid gap-2">
                                <textarea name="body" placeholder="Message employer" className="min-h-16 rounded-md border bg-background px-2 py-1 text-sm" />
                                <Button size="sm" variant="outline">Send</Button>
                            </Form>
                            <Form action={`/employee/applications/${app.id}`} method="delete"><Button variant="outline" size="sm">Withdraw</Button></Form>
                        </div>
                    </td>
                </>
            )} />
        </div>
    );
}
