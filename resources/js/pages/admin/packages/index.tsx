import { Form, Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Field, TextArea } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';

export default function PackagesIndex({ packages }: { packages: any }) {
    return <div className="p-6"><Head title="Packages" /><PageHeader title="Packages" /><Form action="/admin/packages" method="post" className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4"><Field label="Name" name="name" /><Field label="Price" name="price" type="number" /><Field label="Job posts" name="job_posts" type="number" /><Field label="Featured" name="featured_posts" type="number" /><Field label="Currency" name="currency" value="AFN" /><Field label="Days" name="duration_days" type="number" value="30" /><TextArea label="Description" name="description" /><Button className="self-end">Add package</Button></Form><TableShell page={packages} columns={['Name', 'Posts', 'Featured', 'Price']} render={(p: any) => <><td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3">{p.job_posts}</td><td className="px-4 py-3">{p.featured_posts}</td><td className="px-4 py-3">{p.price} {p.currency}</td></>} /></div>;
}
