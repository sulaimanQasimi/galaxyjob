import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function EmployerTeam({ company, members }: { company: any; members: any }) {
    return <div className="p-6"><Head title="Company team" /><PageHeader title="Company team" description={company ? `Invite team members for ${company.name}.` : 'Create a company first.'} /><Form action="/employer/team" method="post" className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-3"><input name="email" type="email" placeholder="Email" className="rounded-md border bg-background px-3 py-2 text-sm" /><input name="role" placeholder="Role" className="rounded-md border bg-background px-3 py-2 text-sm" /><Button>Invite</Button></Form><TableShell page={members} columns={['Email', 'Role', 'Status']} render={(member: any) => <><td className="px-4 py-3">{member.email}</td><td className="px-4 py-3">{member.role}</td><td className="px-4 py-3"><StatusBadge status={member.status} /></td></>} /></div>;
}
