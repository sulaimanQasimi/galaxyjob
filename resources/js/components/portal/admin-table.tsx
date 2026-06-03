import { Form } from '@inertiajs/react';
import Pagination from '@/components/portal/pagination';
import StatusBadge from '@/components/portal/status-badge';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/portal';

export function PageHeader({ title, description }: { title: string; description?: string }) {
    return <div className="mb-6"><h1 className="text-2xl font-semibold">{title}</h1>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>;
}

export function StatGrid({ stats }: { stats: Record<string, number> }) {
    return <div className="grid gap-4 md:grid-cols-4">{Object.entries(stats).map(([key, value]) => <div key={key} className="rounded-lg border bg-card p-5"><div className="text-2xl font-semibold">{value}</div><div className="text-sm capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</div></div>)}</div>;
}

export function TableShell<T>({ page, columns, render }: { page?: Paginated<T> | null; columns: string[]; render: (row: T) => React.ReactNode }) {
    const rows = page?.data ?? [];
    return (
        <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg border bg-card">
                <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-left"><tr>{columns.map((column) => <th key={column} className="px-4 py-3 font-medium">{column}</th>)}</tr></thead>
                    <tbody>{rows.length ? rows.map((row: any) => <tr key={row.id} className="border-t">{render(row)}</tr>) : <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>}</tbody>
                </table>
            </div>
            <Pagination page={page as any} />
        </div>
    );
}

export function StatusForm({ action, fields }: { action: string; fields: Record<string, string | boolean> }) {
    return (
        <Form action={action} method="patch" className="flex items-center gap-2">
            {Object.entries(fields).map(([name, value]) => typeof value === 'boolean'
                ? <input key={name} type="hidden" name={name} value={value ? '1' : '0'} />
                : <input key={name} type="hidden" name={name} value={value} />)}
            <Button size="sm" variant="outline">Save</Button>
        </Form>
    );
}

export { StatusBadge };
