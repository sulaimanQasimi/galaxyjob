import { router } from '@inertiajs/react';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import jobs from '@/routes/jobs';
import type { Job, Location } from '@/types/portal';

const popularTags = ['Remote', 'Finance', 'Design', 'Marketing', 'Engineering'];

export default function SearchHero({
    locations,
    highlightedJobs,
}: {
    locations: Location[];
    highlightedJobs: Job[];
}) {
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const keyword = data.get('keyword')?.toString() ?? '';
        const location = data.get('location')?.toString() ?? '';

        router.get(
            jobs.index.url(),
            { keyword, location },
            { preserveState: false },
        );
    }

    return (
        <section className="relative overflow-hidden bg-white text-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_25%,rgba(14,165,233,0.14),transparent_30%)]" />
            <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                <div className="grid gap-7">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                            <Sparkles className="size-4" />
                            Premium hiring marketplace
                        </div>
                        <h1 className="max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
                            Find work that fits your ambition.
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            Discover verified jobs, trusted employers, and a
                            clearer path from application to offer.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:grid-cols-[1fr_240px_auto]"
                    >
                        <label className="relative block">
                            <span className="sr-only">Job keyword</span>
                            <Search
                                className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />
                            <Input
                                name="keyword"
                                className="h-12 border-0 bg-slate-50 pl-10 text-slate-950 shadow-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                placeholder="Job title, keyword, or company"
                            />
                        </label>
                        <label className="relative block">
                            <span className="sr-only">Location</span>
                            <MapPin
                                className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />
                            <select
                                name="location"
                                className="h-12 w-full rounded-md border-0 bg-slate-50 pr-3 pl-10 text-sm text-slate-950 transition outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All locations</option>
                                {locations.map((location) => (
                                    <option
                                        key={location.id}
                                        value={location.name}
                                    >
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Button className="h-12 rounded-lg bg-emerald-600 px-7 text-base hover:bg-emerald-500">
                            Search jobs
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span>Popular:</span>
                        {popularTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() =>
                                    router.get(jobs.index.url(), {
                                        keyword: tag,
                                    })
                                }
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xl">
                        <div className="rounded-2xl bg-white p-5 text-slate-950 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Hiring activity
                                    </p>
                                    <h2 className="mt-1 text-2xl font-bold">
                                        Live job market
                                    </h2>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                    Active
                                </span>
                            </div>
                            <div className="mt-6 grid gap-3">
                                {highlightedJobs.slice(0, 3).length ? (
                                    highlightedJobs.slice(0, 3).map((job) => (
                                        <a
                                            key={job.id}
                                            href={jobs.show.url(job)}
                                            className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                                        >
                                            <div className="font-semibold">
                                                {job.title}
                                            </div>
                                            <div className="mt-1 flex flex-wrap justify-between gap-2 text-sm text-slate-500">
                                                <span>
                                                    {job.company?.name ??
                                                        'Verified employer'}
                                                </span>
                                                <span>
                                                    {job.location?.name ??
                                                        'Flexible'}
                                                </span>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                                        New verified roles will appear here as
                                        employers publish them.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
