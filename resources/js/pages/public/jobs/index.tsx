import { Form, router, usePage } from '@inertiajs/react';
import JobCard from '@/components/portal/job-card';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Category, Job, Location, Paginated, Skill } from '@/types/portal';

export default function JobsIndex({ jobs, filters, categories, locations, companies, skills, savedSearches, seo }: { jobs: Paginated<Job>; filters: any; categories: Category[]; locations: Location[]; companies: { id: number; name: string }[]; skills: Skill[]; savedSearches: any[]; seo: SeoData }) {
    const { auth } = usePage().props as any;
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get('/jobs', Object.fromEntries(new FormData(event.currentTarget).entries()), { preserveState: true });
    }

    return (
        <PublicLayout>
            <SeoHead seo={seo} />
            <section className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <h1 className="text-3xl font-semibold">Browse jobs</h1>
                    <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-8">
                        <Input className="md:col-span-2" name="search" placeholder="Search keyword" defaultValue={filters.search ?? ''} />
                        <select name="category_id" defaultValue={filters.category_id ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                        <select name="location_id" defaultValue={filters.location_id ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Location</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
                        <select name="company_id" defaultValue={filters.company_id ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Company</option>{companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                        <select name="skill_id" defaultValue={filters.skill_id ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Skill</option>{skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                        <select name="job_type" defaultValue={filters.job_type ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Type</option>{['full_time','part_time','contract','internship','remote'].map((v) => <option key={v} value={v}>{v.replaceAll('_', ' ')}</option>)}</select>
                        <select name="work_mode" defaultValue={filters.work_mode ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Work mode</option>{['on_site','hybrid','remote'].map((v) => <option key={v} value={v}>{v.replaceAll('_', ' ')}</option>)}</select>
                        <select name="experience_level" defaultValue={filters.experience_level ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Experience</option>{['entry','mid','senior'].map((v) => <option key={v} value={v}>{v}</option>)}</select>
                        <Input name="salary_min" type="number" placeholder="Min salary" defaultValue={filters.salary_min ?? ''} />
                        <Input name="salary_max" type="number" placeholder="Max salary" defaultValue={filters.salary_max ?? ''} />
                        <Input name="deadline_from" type="date" defaultValue={filters.deadline_from ?? ''} />
                        <Input name="deadline_to" type="date" defaultValue={filters.deadline_to ?? ''} />
                        <select name="sort" defaultValue={filters.sort ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Newest</option><option value="featured">Featured</option><option value="salary_high">Salary high</option><option value="deadline_soon">Deadline soon</option></select>
                        <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm"><input type="checkbox" name="is_featured" value="1" defaultChecked={filters.is_featured === '1'} /> Featured</label>
                        <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm"><input type="checkbox" name="is_urgent" value="1" defaultChecked={filters.is_urgent === '1'} /> Urgent</label>
                        <Button type="submit">Filter</Button>
                    </form>
                    {auth?.user?.role === 'employee' && (
                        <Form action="/jobs/searches" method="post" className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(filters).map(([key, value]) => value ? <input key={key} type="hidden" name={key} value={String(value)} /> : null)}
                            <Input name="name" placeholder="Saved search name" className="max-w-xs bg-white" />
                            <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm"><input type="checkbox" name="email_alerts" value="1" /> Email alerts</label>
                            <Button variant="outline">Save search</Button>
                        </Form>
                    )}
                    {savedSearches.length > 0 && <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">{savedSearches.slice(0, 5).map((search) => <span key={search.id} className="rounded-md border bg-white px-2 py-1">{search.name}</span>)}</div>}
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
                {jobs.data.length ? jobs.data.map((job) => <JobCard key={job.id} job={job} />) : <p className="rounded-lg border bg-white p-6 text-muted-foreground md:col-span-2 lg:col-span-3">No jobs match your filters.</p>}
            </section>
            <div className="mx-auto max-w-7xl px-4 pb-10"><Pagination page={jobs} /></div>
        </PublicLayout>
    );
}
