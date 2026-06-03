import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import JobCard from '@/components/portal/job-card';
import PublicLayout from '@/components/portal/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Category, Job, Location } from '@/types/portal';

export default function Home({ stats, featuredJobs, latestJobs, categories, locations }: { stats: any; featuredJobs: Job[]; latestJobs: Job[]; categories: Category[]; locations: Location[] }) {
    function search(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        router.get('/jobs', Object.fromEntries(data.entries()));
    }

    return (
        <PublicLayout>
            <Head title="Find jobs in Afghanistan" />
            <section className="bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
                    <div className="grid content-center gap-6">
                        <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">Afghanistan job portal</p>
                            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Find the right job, team, and next step.</h1>
                            <p className="mt-4 max-w-2xl text-lg text-slate-600">Browse verified companies, active vacancies, and practical hiring workflows for jobseekers and employers.</p>
                        </div>
                        <form onSubmit={search} className="grid gap-3 rounded-lg border bg-slate-50 p-3 md:grid-cols-[1fr_220px_auto]">
                            <Input name="search" placeholder="Keyword, title, skill" />
                            <select name="location_id" className="rounded-md border bg-white px-3 py-2 text-sm">
                                <option value="">All locations</option>
                                {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                            </select>
                            <Button type="submit"><Search className="size-4" /> Search</Button>
                        </form>
                        <div className="grid grid-cols-3 gap-3">
                            <Stat label="Active jobs" value={stats.jobs} />
                            <Stat label="Companies" value={stats.companies} />
                            <Stat label="Categories" value={stats.categories} />
                        </div>
                    </div>
                    <div className="grid gap-3 rounded-lg bg-emerald-950 p-5 text-white">
                        <h2 className="text-xl font-semibold">Featured opportunities</h2>
                        {featuredJobs.slice(0, 4).map((job) => (
                            <Link key={job.id} href={`/jobs/${job.slug}`} className="rounded-md bg-white/10 p-4 hover:bg-white/15">
                                <div className="font-medium">{job.title}</div>
                                <div className="text-sm text-emerald-100">{job.company?.name} • {job.location?.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Latest jobs</h2>
                    <Button asChild variant="outline"><Link href="/jobs">View all</Link></Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {latestJobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
            </section>
            <section className="mx-auto max-w-7xl px-4 pb-12">
                <h2 className="mb-5 text-2xl font-semibold">Popular categories</h2>
                <div className="grid gap-3 md:grid-cols-5">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/jobs?category_id=${category.id}`} className="rounded-lg border bg-white p-4 hover:border-emerald-500">
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">{category.jobs_count ?? 0} jobs</div>
                        </Link>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return <div className="rounded-lg border bg-white p-4"><div className="text-2xl font-semibold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div>;
}
