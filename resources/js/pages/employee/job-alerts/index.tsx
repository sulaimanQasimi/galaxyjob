import { Form, Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';

export default function JobAlerts({
    alerts,
    savedSearches,
    scholarshipAlerts,
    scholarshipCategories,
    categories,
    locations,
}: {
    alerts: any;
    savedSearches: any[];
    scholarshipAlerts: any[];
    scholarshipCategories: any[];
    categories: any[];
    locations: any[];
}) {
    return (
        <div className="p-6">
            <Head title="Job alerts" />
            <PageHeader
                title="Job alerts"
                description="Email alerts are checked hourly for new matching jobs."
            />
            {savedSearches.length > 0 && (
                <section className="mb-6 rounded-lg border bg-card p-4">
                    <h2 className="font-semibold">Saved searches</h2>
                    <div className="mt-3 grid gap-2 text-sm">
                        {savedSearches.map((search) => (
                            <div
                                key={search.id}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2"
                            >
                                <span>{search.name}</span>
                                <span className="text-muted-foreground">
                                    {Object.entries(search.filters ?? {})
                                        .map(
                                            ([key, value]) =>
                                                `${key}: ${value}`,
                                        )
                                        .join(' - ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <Form
                action="/employee/job-alerts"
                method="post"
                className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4"
            >
                <input
                    name="keyword"
                    placeholder="Keyword"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                />
                <select
                    name="category_id"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                    <option value="">Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    name="location_id"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                    <option value="">Location</option>
                    {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
                <Button>Add alert</Button>
            </Form>
            <Form
                action="/employee/scholarship-alerts"
                method="post"
                className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-5"
            >
                <input name="keyword" placeholder="Scholarship keyword" className="rounded-md border bg-background px-3 py-2 text-sm" />
                <select name="scholarship_category_id" className="rounded-md border bg-background px-3 py-2 text-sm"><option value="">Scholarship category</option>{scholarshipCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input name="country" placeholder="Country" className="rounded-md border bg-background px-3 py-2 text-sm" />
                <input name="study_level" placeholder="Study level" className="rounded-md border bg-background px-3 py-2 text-sm" />
                <Button>Add scholarship alert</Button>
            </Form>
            {scholarshipAlerts.length > 0 && <section className="mb-6 rounded-lg border bg-card p-4"><h2 className="font-semibold">Scholarship alerts</h2><div className="mt-3 grid gap-2 text-sm">{scholarshipAlerts.map((alert) => <div key={alert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2"><span>{alert.keyword || alert.category?.name || 'Any scholarship'}</span><Form action={`/employee/scholarship-alerts/${alert.id}`} method="delete"><Button size="sm" variant="destructive">Delete</Button></Form></div>)}</div></section>}
            <TableShell
                page={alerts}
                columns={[
                    'Keyword',
                    'Category',
                    'Location',
                    'Last sent',
                    'Action',
                ]}
                render={(alert: any) => (
                    <>
                        <td className="px-4 py-3">{alert.keyword || 'Any'}</td>
                        <td className="px-4 py-3">
                            {alert.category?.name || 'Any'}
                        </td>
                        <td className="px-4 py-3">
                            {alert.location?.name || 'Any'}
                        </td>
                        <td className="px-4 py-3">
                            {alert.last_sent_at
                                ? formatDateTime(alert.last_sent_at)
                                : 'Not yet'}
                        </td>
                        <td className="px-4 py-3">
                            <Form
                                action={`/employee/job-alerts/${alert.id}`}
                                method="delete"
                            >
                                <Button size="sm" variant="destructive">
                                    Delete
                                </Button>
                            </Form>
                        </td>
                    </>
                )}
            />
        </div>
    );
}
