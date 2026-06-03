import { Form, Head } from '@inertiajs/react';
import { Field, TextArea } from '@/components/portal/form-fields';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function CategoriesIndex({ categories }: { categories: any }) {
    return <div className="p-6"><Head title="Categories" /><PageHeader title="Categories" /><Form action="/admin/categories" method="post" className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_1fr_auto]"><Field label="Name" name="name" /><TextArea label="Description" name="description" /><Button className="self-end">Add</Button></Form><TableShell page={categories} columns={['Name', 'Jobs', 'Status']} render={(c: any) => <><td className="px-4 py-3 font-medium">{c.name}</td><td className="px-4 py-3">{c.jobs_count}</td><td className="px-4 py-3">{c.is_active ? 'active' : 'inactive'}</td></>} /></div>;
}
