import { Form, Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Field } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';

export default function LocationsIndex({ locations }: { locations: any }) {
    return <div className="p-6"><Head title="Locations" /><PageHeader title="Locations" /><Form action="/admin/locations" method="post" className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_1fr_auto]"><Field label="Name" name="name" /><Field label="Country" name="country" value="Afghanistan" /><Button className="self-end">Add</Button></Form><TableShell page={locations} columns={['Name', 'Country', 'Jobs']} render={(l: any) => <><td className="px-4 py-3 font-medium">{l.name}</td><td className="px-4 py-3">{l.country}</td><td className="px-4 py-3">{l.jobs_count}</td></>} /></div>;
}
