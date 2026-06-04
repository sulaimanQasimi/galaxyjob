import { Form, Head } from '@inertiajs/react';
import { PageHeader } from '@/components/portal/admin-table';
import { Field, TextArea } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';
import type { Skill } from '@/types/portal';

export default function ProfileEdit({ profile, skills }: { profile?: any; skills: Skill[] }) {
    const selected = new Set(profile?.skills?.map((skill: Skill) => String(skill.id)) ?? []);

    return (
        <div className="p-6">
            <Head title="Resume profile" />
            <PageHeader title="Resume profile" description="Keep your jobseeker profile and CV current." />
            {profile && <a className="mb-4 inline-block text-sm text-emerald-700" href="/employee/profile/cv.pdf">Download generated CV</a>}
            <Form action="/employee/profile" method="post" encType="multipart/form-data" className="grid max-w-4xl gap-4 rounded-lg border bg-card p-5 md:grid-cols-2">
                <Field label="Headline" name="headline" value={profile?.headline} />
                <Field label="Public profile slug" name="public_slug" value={profile?.public_slug} />
                <Field label="Phone" name="phone" value={profile?.phone} />
                <Field label="Address" name="address" value={profile?.address} />
                <Field label="Experience years" name="experience_years" type="number" value={profile?.experience_years ?? 0} />
                <Field label="Expected salary" name="expected_salary" type="number" value={profile?.expected_salary} />
                <Field label="Portfolio URL" name="portfolio_url" value={profile?.portfolio_url} />
                <Field label="CV file" name="cv_file" type="file" />
                <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" name="is_public" value="1" defaultChecked={profile?.is_public} /> Public candidate profile</label>
                <div className="md:col-span-2"><TextArea label="Summary" name="summary" value={profile?.summary} /></div>
                <div className="md:col-span-2"><TextArea label="Education" name="education" value={profile?.education} /></div>
                <div className="md:col-span-2"><TextArea label="Languages" name="languages" value={profile?.languages} /></div>
                <div className="md:col-span-2"><TextArea label="Certifications" name="certifications" value={profile?.certifications} /></div>
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Skills</label>
                    <div className="grid gap-2 md:grid-cols-4">{skills.map((skill) => <label key={skill.id} className="flex items-center gap-2 rounded-md border p-2 text-sm"><input type="checkbox" name="skill_ids[]" value={skill.id} defaultChecked={selected.has(String(skill.id))} />{skill.name}</label>)}</div>
                </div>
                <Button className="md:col-span-2">Save profile</Button>
                {profile?.is_public && profile?.public_slug && <a className="text-sm text-emerald-700 md:col-span-2" href={`/candidates/${profile.public_slug}`}>View public profile</a>}
            </Form>
        </div>
    );
}
