import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Field, TextArea } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';

export default function EmailTemplates({ templates }: { templates: any }) {
    return <div className="grid gap-6 p-6"><Head title="Email templates" /><PageHeader title="Email templates" description="Manage reusable subjects and bodies for workflow emails." /><TemplateForm action="/admin/email-templates" /><TableShell page={templates} columns={['Template', 'Key', 'Status', 'Edit']} render={(template: any) => <><td className="px-4 py-3 font-medium">{template.name}</td><td className="px-4 py-3">{template.key}</td><td className="px-4 py-3"><StatusBadge status={template.is_active ? 'active' : 'inactive'} /></td><td className="px-4 py-3"><TemplateForm action={`/admin/email-templates/${template.id}`} method="patch" template={template} compact /></td></>} /></div>;
}

function TemplateForm({ action, method = 'post', template, compact = false }: { action: string; method?: 'post' | 'patch'; template?: any; compact?: boolean }) {
    return <Form action={action} method={method} className={`grid gap-3 rounded-lg border bg-card p-4 ${compact ? 'min-w-96' : 'md:grid-cols-4'}`}><Field label="Key" name="key" value={template?.key} /><Field label="Name" name="name" value={template?.name} /><Field label="Subject" name="subject" value={template?.subject} /><div className={compact ? '' : 'md:col-span-3'}><TextArea label="Body" name="body" value={template?.body} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" value="1" defaultChecked={template?.is_active ?? true} /> Active</label><Button>{template ? 'Update' : 'Add template'}</Button></Form>;
}
