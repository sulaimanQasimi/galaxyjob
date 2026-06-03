import { Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';

export default function EmployeeApplications({ applications }: { applications: any }) {
    return <div className="p-6"><Head title="My applications" /><PageHeader title="My applications" /><TableShell page={applications} columns={['Job', 'Company', 'Status']} render={(app: any) => <><td className="px-4 py-3 font-medium">{app.job?.title}</td><td className="px-4 py-3">{app.job?.company?.name}</td><td className="px-4 py-3"><StatusBadge status={app.status} /></td></>} /></div>;
}
