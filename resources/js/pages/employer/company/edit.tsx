import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge } from '@/components/portal/admin-table';
import { Field, TextArea } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/portal';

export default function CompanyEdit({ company }: { company?: Company }) {
    return (
        <div className="p-6">
            <Head title="Company profile" />
            <PageHeader title="Company profile" description="Company changes remain pending until admin approval when required." />
            {company && <div className="mb-4 flex flex-wrap items-center gap-3"><StatusBadge status={company.verification_status} />{company.moderation_note && <span className="text-sm text-amber-700">{company.moderation_note}</span>}</div>}
            <Form action="/employer/company" method="post" encType="multipart/form-data" className="grid max-w-4xl gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
                <Field label="Company name" name="name" value={company?.name} />
                <Field label="Industry" name="industry" value={company?.industry} />
                <Field label="Company size" name="company_size" type="number" value={company?.company_size} />
                <Field label="Website" name="website" value={company?.website} />
                <Field label="Phone" name="phone" value={company?.phone} />
                <Field label="Email" name="email" value={company?.email} />
                <Field label="Address" name="address" value={company?.address} />
                <Field label="Logo" name="logo" type="file" />
                <Field label="Cover image" name="cover_image" type="file" />
                <Field label="Verification document type" name="verification_document_type" value="Business license" />
                <Field label="Verification document" name="verification_document" type="file" />
                <div className="md:col-span-2"><TextArea label="Description" name="description" value={company?.description} /></div>
                {company?.verification_documents?.length ? <div className="md:col-span-2 rounded-md border p-3 text-sm"><div className="font-medium">Uploaded verification documents</div>{company.verification_documents.map((doc: any) => <div key={doc.id} className="mt-2 flex flex-wrap items-center gap-2"><a className="text-emerald-700" href={`/storage/${doc.file_path}`}>{doc.document_type}</a><StatusBadge status={doc.status} />{doc.note && <span className="text-muted-foreground">{doc.note}</span>}</div>)}</div> : null}
                <Button className="md:col-span-2">Save company</Button>
            </Form>
        </div>
    );
}
