import { Form, Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function JobAlerts({ alerts, categories, locations }: { alerts: any; categories: any[]; locations: any[] }) {
    return (
        <div className="p-6">
            <Head title="Job alerts" />
            <PageHeader title="Job alerts" description="Email alerts are checked hourly for new matching jobs." />
            <Form action="/employee/job-alerts" method="post" className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
                <input name="keyword" placeholder="Keyword" className="rounded-md border bg-background px-3 py-2 text-sm" />
                <select name="category_id" className="rounded-md border bg-background px-3 py-2 text-sm"><option value="">Category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select name="location_id" className="rounded-md border bg-background px-3 py-2 text-sm"><option value="">Location</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
                <Button>Add alert</Button>
            </Form>
            <TableShell page={alerts} columns={['Keyword', 'Category', 'Location', 'Last sent', 'Action']} render={(alert: any) => (
                <>
                    <td className="px-4 py-3">{alert.keyword || 'Any'}</td>
                    <td className="px-4 py-3">{alert.category?.name || 'Any'}</td>
                    <td className="px-4 py-3">{alert.location?.name || 'Any'}</td>
                    <td className="px-4 py-3">{alert.last_sent_at ?? 'Not yet'}</td>
                    <td className="px-4 py-3"><Form action={`/employee/job-alerts/${alert.id}`} method="delete"><Button size="sm" variant="destructive">Delete</Button></Form></td>
                </>
            )} />
        </div>
    );
}
