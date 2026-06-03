import { Form, Head } from '@inertiajs/react';
import { Field, TextArea } from '@/components/portal/form-fields';
import { PageHeader, StatusBadge } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/portal';

export default function CompanyEdit({ company }: { company?: Company }) {
    return <div className="p-6"><Head title="Company profile" /><PageHeader title="Company profile" description="Company changes remain pending until admin approval when required." />{company && <div className="mb-4"><StatusBadge status={company.verification_status} /></div>}<Form action="/employer/company" method="post" encType="multipart/form-data" className="grid max-w-4xl gap-4 rounded-lg border bg-card p-5 md:grid-cols-2"><Field label="Company name" name="name" value={company?.name} /><Field label="Industry" name="industry" value={company?.industry} /><Field label="Website" name="website" value={company?.website} /><Field label="Phone" name="phone" value={company?.phone} /><Field label="Email" name="email" value={company?.email} /><Field label="Address" name="address" value={company?.address} /><Field label="Logo" name="logo" type="file" /><Field label="Cover image" name="cover_image" type="file" /><div className="md:col-span-2"><TextArea label="Description" name="description" value={company?.description} /></div><Button className="md:col-span-2">Save company</Button></Form></div>;
}
