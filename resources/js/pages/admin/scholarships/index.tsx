import { Form, Head } from '@inertiajs/react';
import {
    PageHeader,
    StatusBadge,
    TableShell,
} from '@/components/portal/admin-table';
import { Field, TextArea } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';
import { dateInputValue, formatDate } from '@/lib/utils';
import type { Scholarship } from '@/types/portal';

export default function ScholarshipsIndex({
    scholarships,
    categories,
}: {
    scholarships: any;
    categories: any[];
}) {
    return (
        <div className="grid gap-6 p-6">
            <Head title="Scholarships" />
            <PageHeader
                title="Scholarships"
                description="Admin-only scholarship publishing. Public users can view details but cannot apply inside the portal."
            />
            <Form action="/admin/scholarship-categories" method="post" className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-3">
                <Field label="New category" name="name" />
                <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" name="is_active" value="1" defaultChecked /> Active</label>
                <Button className="self-end">Add category</Button>
            </Form>
            <ScholarshipForm action="/admin/scholarships" categories={categories} />
            <TableShell
                page={scholarships}
                columns={['Scholarship', 'Deadline', 'Visibility', 'Edit']}
                render={(scholarship: Scholarship) => (
                    <>
                        <td className="px-4 py-3">
                            <div className="font-medium">
                                {scholarship.title}
                            </div>
                            <div className="text-muted-foreground">
                                {[
                                    scholarship.provider,
                                    scholarship.country,
                                    scholarship.study_level,
                                ]
                                    .filter(Boolean)
                                    .join(' - ')}
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            {scholarship.deadline
                                ? formatDate(scholarship.deadline)
                                : 'Open'}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge
                                    status={
                                        scholarship.is_published
                                            ? 'published'
                                            : 'draft'
                                    }
                                />
                                {scholarship.is_featured && (
                                    <StatusBadge status="featured" />
                                )}
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <ScholarshipForm
                                action={`/admin/scholarships/${scholarship.id}`}
                                method="patch"
                                scholarship={scholarship}
                                categories={categories}
                                compact
                            />
                        </td>
                    </>
                )}
            />
        </div>
    );
}

function ScholarshipForm({
    action,
    method = 'post',
    scholarship,
    categories,
    compact = false,
}: {
    action: string;
    method?: 'post' | 'patch';
    scholarship?: Scholarship;
    categories: any[];
    compact?: boolean;
}) {
    return (
        <Form
            action={action}
            method={method}
            className={`grid gap-3 rounded-lg border bg-card p-4 ${compact ? 'min-w-96' : 'md:grid-cols-4'}`}
        >
            <Field label="Title" name="title" value={scholarship?.title} />
            <select name="scholarship_category_id" defaultValue={(scholarship as any)?.scholarship_category_id ?? ''} className="rounded-md border bg-background px-3 py-2 text-sm"><option value="">Category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
            <Field
                label="Provider"
                name="provider"
                value={scholarship?.provider}
            />
            <Field
                label="Country"
                name="country"
                value={scholarship?.country}
            />
            <Field
                label="Study level"
                name="study_level"
                value={scholarship?.study_level}
            />
            <Field
                label="Funding type"
                name="funding_type"
                value={scholarship?.funding_type}
            />
            <select name="language" defaultValue={(scholarship as any)?.language ?? 'en'} className="rounded-md border bg-background px-3 py-2 text-sm"><option value="en">English</option><option value="fa">Dari</option><option value="ps">Pashto</option></select>
            <Field
                label="Deadline"
                name="deadline"
                type="date"
                value={dateInputValue(scholarship?.deadline)}
            />
            <Field
                label="Official URL"
                name="official_url"
                value={scholarship?.official_url}
            />
            <Field
                label="Summary"
                name="summary"
                value={scholarship?.summary}
            />
            <div className={compact ? '' : 'md:col-span-2'}>
                <TextArea
                    label="Description"
                    name="description"
                    value={scholarship?.description}
                />
            </div>
            <div className={compact ? '' : 'md:col-span-2'}>
                <TextArea
                    label="Eligibility"
                    name="eligibility"
                    value={scholarship?.eligibility}
                />
            </div>
            <div className={compact ? '' : 'md:col-span-2'}>
                <TextArea
                    label="Benefits"
                    name="benefits"
                    value={scholarship?.benefits}
                />
            </div>
            <label className="flex items-center gap-2 self-end text-sm">
                <input
                    type="checkbox"
                    name="is_featured"
                    value="1"
                    defaultChecked={scholarship?.is_featured}
                />{' '}
                Featured
            </label>
            <label className="flex items-center gap-2 self-end text-sm">
                <input
                    type="checkbox"
                    name="is_published"
                    value="1"
                    defaultChecked={scholarship?.is_published ?? true}
                />{' '}
                Published
            </label>
            <Button className={compact ? '' : 'md:col-span-2'}>
                {scholarship ? 'Update scholarship' : 'Add scholarship'}
            </Button>
        </Form>
    );
}
