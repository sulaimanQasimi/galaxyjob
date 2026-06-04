import { Link, router } from '@inertiajs/react';
import { CalendarClock, GraduationCap, MapPin, Search } from 'lucide-react';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import StatusBadge from '@/components/portal/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import type { Paginated, Scholarship } from '@/types/portal';

type Facets = {
    countries: string[];
    studyLevels: string[];
    fundingTypes: string[];
};

export default function ScholarshipsIndex({
    scholarships,
    filters,
    facets,
    seo,
}: {
    scholarships: Paginated<Scholarship>;
    filters: any;
    facets: Facets;
    seo: SeoData;
}) {
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/scholarships',
            Object.fromEntries(new FormData(event.currentTarget).entries()),
            { preserveState: true },
        );
    }

    return (
        <PublicLayout>
            <SeoHead seo={seo} />
            <section className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <p className="font-semibold text-emerald-700">
                        Scholarships
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                        Browse scholarship opportunities
                    </h1>
                    <p className="mt-3 max-w-3xl text-slate-600">
                        Public scholarship information curated by Galaxy Jobs.
                        These listings are informational only, with no internal
                        application form.
                    </p>
                    <form
                        onSubmit={submit}
                        className="mt-6 grid gap-3 md:grid-cols-6"
                    >
                        <div className="relative md:col-span-2">
                            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-slate-400" />
                            <Input
                                name="search"
                                placeholder="Search scholarship"
                                defaultValue={filters.search ?? ''}
                                className="bg-white pl-9"
                            />
                        </div>
                        <select
                            name="country"
                            defaultValue={filters.country ?? ''}
                            className="rounded-md border bg-white px-3 py-2 text-sm"
                        >
                            <option value="">Country</option>
                            {facets.countries.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <select
                            name="study_level"
                            defaultValue={filters.study_level ?? ''}
                            className="rounded-md border bg-white px-3 py-2 text-sm"
                        >
                            <option value="">Study level</option>
                            {facets.studyLevels.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <select
                            name="funding_type"
                            defaultValue={filters.funding_type ?? ''}
                            className="rounded-md border bg-white px-3 py-2 text-sm"
                        >
                            <option value="">Funding</option>
                            {facets.fundingTypes.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <Button>Filter</Button>
                    </form>
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
                {scholarships.data.length ? (
                    scholarships.data.map((scholarship) => (
                        <ScholarshipCard
                            key={scholarship.id}
                            scholarship={scholarship}
                        />
                    ))
                ) : (
                    <p className="rounded-lg border bg-white p-6 text-muted-foreground md:col-span-2 lg:col-span-3">
                        No scholarships match your filters.
                    </p>
                )}
            </section>
            <div className="mx-auto max-w-7xl px-4 pb-10">
                <Pagination page={scholarships} />
            </div>
        </PublicLayout>
    );
}

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
    return (
        <article className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <GraduationCap className="size-6 shrink-0 text-emerald-700" />
                <div className="flex flex-wrap gap-2">
                    {scholarship.is_featured && (
                        <StatusBadge status="featured" />
                    )}
                </div>
            </div>
            <h2 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-950">
                <Link
                    href={`/scholarships/${scholarship.slug}`}
                    className="hover:text-emerald-700"
                >
                    {scholarship.title}
                </Link>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
                {scholarship.summary ?? scholarship.description}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
                {scholarship.country && (
                    <span className="flex items-center gap-2">
                        <MapPin className="size-4 text-slate-400" />
                        {scholarship.country}
                    </span>
                )}
                {scholarship.deadline && (
                    <span className="flex items-center gap-2">
                        <CalendarClock className="size-4 text-slate-400" />
                        Deadline {formatDate(scholarship.deadline)}
                    </span>
                )}
                <span>
                    {[
                        scholarship.provider,
                        scholarship.study_level,
                        scholarship.funding_type,
                    ]
                        .filter(Boolean)
                        .join(' - ')}
                </span>
            </div>
            <Button asChild className="mt-5" variant="outline">
                <Link href={`/scholarships/${scholarship.slug}`}>
                    View details
                </Link>
            </Button>
        </article>
    );
}
