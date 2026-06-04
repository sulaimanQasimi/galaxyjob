import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function PaymentsIndex({ payments }: { payments: any }) {
    return <div className="p-6"><Head title="Payments" /><PageHeader title="Payments" description="Manual payment review for MVP." /><div className="mb-4 text-sm"><a className="text-emerald-700" href="/admin/exports/payments">Export payments CSV</a></div><TableShell page={payments} columns={['Employer', 'Package', 'Amount', 'Status', 'Action']} render={(p: any) => <><td className="px-4 py-3">{p.user?.name}</td><td className="px-4 py-3">{p.package?.name ?? 'Manual'}</td><td className="px-4 py-3">{p.amount} {p.currency}</td><td className="px-4 py-3"><StatusBadge status={p.status} /></td><td className="px-4 py-3"><Form action={`/admin/payments/${p.id}`} method="patch" className="flex gap-2"><select name="status" defaultValue={p.status} className="rounded-md border bg-background px-2 py-1"><option>pending</option><option>approved</option><option>rejected</option></select><Button size="sm">Save</Button></Form></td></>} /></div>;
}
