import { Form, Head } from '@inertiajs/react';
import { Field, TextArea } from '@/components/portal/form-fields';
import { PageHeader } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function ProfileEdit({ profile }: { profile?: any }) {
    return <div className="p-6"><Head title="Resume profile" /><PageHeader title="Resume profile" description="Keep your jobseeker profile and CV current." /><Form action="/employee/profile" method="post" encType="multipart/form-data" className="grid max-w-4xl gap-4 rounded-lg border bg-card p-5 md:grid-cols-2"><Field label="Headline" name="headline" value={profile?.headline} /><Field label="Phone" name="phone" value={profile?.phone} /><Field label="Address" name="address" value={profile?.address} /><Field label="Experience years" name="experience_years" type="number" value={profile?.experience_years ?? 0} /><Field label="Expected salary" name="expected_salary" type="number" value={profile?.expected_salary} /><Field label="CV file" name="cv_file" type="file" /><div className="md:col-span-2"><TextArea label="Summary" name="summary" value={profile?.summary} /></div><div className="md:col-span-2"><TextArea label="Education" name="education" value={profile?.education} /></div><Button className="md:col-span-2">Save profile</Button></Form></div>;
}
