import { Form, Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function UsersIndex({ users }: { users: any }) {
    return <div className="p-6"><Head title="Users" /><PageHeader title="Users" description="Activate, deactivate, and adjust roles." /><div className="mb-4 text-sm"><a className="text-emerald-700" href="/admin/exports/users">Export users CSV</a></div><TableShell page={users} columns={['User', 'Role', 'Status', 'Action']} render={(user: any) => <><td className="px-4 py-3"><div className="font-medium">{user.name}</div><div className="text-muted-foreground">{user.email}</div></td><td className="px-4 py-3">{user.role}</td><td className="px-4 py-3">{user.status}</td><td className="px-4 py-3"><Form action={`/admin/users/${user.id}`} method="patch" className="flex gap-2"><select name="role" defaultValue={user.role} className="rounded-md border bg-background px-2 py-1"><option>admin</option><option>employee</option><option>employer</option></select><select name="status" defaultValue={user.status} className="rounded-md border bg-background px-2 py-1"><option>active</option><option>inactive</option></select><Button size="sm">Save</Button></Form></td></>} /></div>;
}
