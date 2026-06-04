import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function CompaniesIndex({ companies }: { companies: any }) {
    return (
        <div className="p-6">
            <Head title="Companies" />
            <PageHeader title="Companies" description="Approve employer companies and control visibility." />
            <div className="mb-4 flex flex-wrap gap-2 text-sm"><a className="text-emerald-700" href="/admin/moderation">Moderation queue</a></div>
            <TableShell page={companies} columns={['Company', 'Owner', 'Status', 'Jobs', 'Action']} render={(company: any) => (
                <>
                    <td className="px-4 py-3"><div className="font-medium">{company.name}</div>{company.moderation_note && <div className="mt-1 text-xs text-amber-700">{company.moderation_note}</div>}</td>
                    <td className="px-4 py-3">{company.user?.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={company.verification_status} /></td>
                    <td className="px-4 py-3">{company.jobs_count}</td>
                    <td className="px-4 py-3"><Form action={`/admin/companies/${company.id}`} method="patch" className="grid min-w-56 gap-2"><select name="verification_status" defaultValue={company.verification_status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>approved</option><option>rejected</option></select><select name="is_active" defaultValue={company.is_active ? '1' : '0'} className="rounded-md border bg-background px-2 py-1"><option value="1">active</option><option value="0">inactive</option></select><textarea name="moderation_note" placeholder="Feedback note" className="min-h-20 rounded-md border bg-background px-2 py-1 text-sm" defaultValue={company.moderation_note ?? ''} /><Button size="sm">Save</Button></Form></td>
                </>
            )} />
        </div>
    );
}
