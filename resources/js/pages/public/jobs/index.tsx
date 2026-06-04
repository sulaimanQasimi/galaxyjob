import { router } from '@inertiajs/react';
import JobCard from '@/components/portal/job-card';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Category, Job, Location, Paginated } from '@/types/portal';

export default function JobsIndex({ jobs, filters, categories, locations, seo }: { jobs: Paginated<Job>; filters: any; categories: Category[]; locations: Location[]; seo: SeoData }) {
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
                        <select name="job_type" defaultValue={filters.job_type ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Type</option>{['full_time','part_time','contract','internship','remote'].map((v) => <option key={v} value={v}>{v.replaceAll('_', ' ')}</option>)}</select>
                        <select name="experience_level" defaultValue={filters.experience_level ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Experience</option>{['entry','mid','senior'].map((v) => <option key={v} value={v}>{v}</option>)}</select>
                        <Input name="salary_min" type="number" placeholder="Min salary" defaultValue={filters.salary_min ?? ''} />
                        <Button type="submit">Filter</Button>
                    </form>
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
                {jobs.data.length ? jobs.data.map((job) => <JobCard key={job.id} job={job} />) : <p className="rounded-lg border bg-white p-6 text-muted-foreground md:col-span-2 lg:col-span-3">No jobs match your filters.</p>}
            </section>
            <div className="mx-auto max-w-7xl px-4 pb-10"><Pagination page={jobs} /></div>
        </PublicLayout>
    );
}
