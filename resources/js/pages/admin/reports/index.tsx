import { Head } from '@inertiajs/react';
import { PageHeader, StatGrid } from '@/components/portal/admin-table';

export default function Reports({ stats, topCategories, applicationsByStatus, paymentsByStatus }: { stats: Record<string, number>; topCategories: any[]; applicationsByStatus: Record<string, number>; paymentsByStatus: Record<string, number> }) {
    return <div className="grid gap-6 p-6"><Head title="Reports" /><PageHeader title="Advanced reports" description="Monthly activity, revenue, hires, and top categories." /><StatGrid stats={stats} /><section className="grid gap-6 lg:grid-cols-3"><Panel title="Top categories" rows={topCategories.map((c) => [c.name, c.jobs_count])} /><Panel title="Applications" rows={Object.entries(applicationsByStatus)} /><Panel title="Payments" rows={Object.entries(paymentsByStatus)} /></section></div>;
}

function Panel({ title, rows }: { title: string; rows: any[] }) {
    return <div className="rounded-lg border bg-card p-5"><h2 className="mb-3 font-semibold">{title}</h2><div className="grid gap-2 text-sm">{rows.map(([label, value]) => <div key={label} className="flex justify-between rounded-md border p-2"><span>{label}</span><span className="font-medium">{value}</span></div>)}</div></div>;
}
