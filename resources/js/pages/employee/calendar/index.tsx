import { Head } from '@inertiajs/react';
import { PageHeader, StatusBadge } from '@/components/portal/admin-table';
import { formatDateTime } from '@/lib/utils';

export default function EmployeeCalendar({ interviews }: { interviews: any[] }) {
    return <div className="p-6"><Head title="My interview calendar" /><PageHeader title="My interview calendar" description="Upcoming interviews from your applications." /><div className="grid gap-3">{interviews.flatMap((app) => (app.status_updates ?? []).map((update: any) => <div key={`${app.id}-${update.id}`} className="rounded-lg border bg-card p-4"><div className="font-medium">{formatDateTime(update.interview_at)}</div><div className="text-sm text-muted-foreground">{app.job?.title} - {app.job?.company?.name}</div><StatusBadge status={app.status} /></div>))}</div></div>;
}
