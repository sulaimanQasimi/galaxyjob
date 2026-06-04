import { Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';

export default function AuditLogsIndex({ logs }: { logs: any }) {
    return (
        <div className="p-6">
            <Head title="Audit logs" />
            <PageHeader title="Audit logs" description="Track important administrative and workflow changes." />
            <TableShell page={logs} columns={['Action', 'Actor', 'Target', 'Changes', 'When']} render={(log: any) => (
                <>
                    <td className="px-4 py-3 font-medium">{log.action}</td>
                    <td className="px-4 py-3">{log.user?.name ?? 'System'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.auditable_type ? `${log.auditable_type} #${log.auditable_id}` : 'General'}</td>
                    <td className="px-4 py-3"><pre className="max-w-md whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify({ old: log.old_values, new: log.new_values }, null, 2)}</pre></td>
                    <td className="px-4 py-3 text-muted-foreground">{log.created_at}</td>
                </>
            )} />
        </div>
    );
}
