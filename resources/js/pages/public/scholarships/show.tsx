import { Link } from '@inertiajs/react';
import {
    CalendarClock,
    ExternalLink,
    GraduationCap,
    MapPin,
} from 'lucide-react';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import StatusBadge from '@/components/portal/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Scholarship } from '@/types/portal';

export default function ScholarshipShow({
    scholarship,
    relatedScholarships,
    seo,
}: {
    scholarship: Scholarship;
    relatedScholarships: Scholarship[];
    seo: SeoData;
}) {
    return (
        <PublicLayout>
            <SeoHead seo={seo} />
            <section className="border-b bg-white">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10">
                    <div className="flex flex-wrap items-center gap-2">
                        {scholarship.is_featured && (
                            <StatusBadge status="featured" />
                        )}
                        {scholarship.funding_type && (
                            <StatusBadge status={scholarship.funding_type} />
                        )}
                    </div>
                    <h1 className="max-w-4xl text-3xl font-semibold text-slate-950">
                        {scholarship.title}
                    </h1>
                    <p className="max-w-3xl text-slate-600">
                        {scholarship.summary}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        {scholarship.provider && (
                            <span className="flex items-center gap-2">
                                <GraduationCap className="size-4 text-slate-400" />
                                {scholarship.provider}
                            </span>
                        )}
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
                    </div>
                    {scholarship.official_url && (
                        <Button asChild variant="outline" className="w-fit">
                            <a
                                href={scholarship.official_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink className="size-4" />
                                Official information
                            </a>
                        </Button>
                    )}
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
                <article className="grid gap-6 rounded-lg border bg-white p-6">
                    <Block title="Description" body={scholarship.description} />
                    <Block title="Eligibility" body={scholarship.eligibility} />
                    <Block title="Benefits" body={scholarship.benefits} />
                    <p className="rounded-md border bg-slate-50 p-3 text-sm text-slate-600">
                        This scholarship is displayed for public information
                        only. Galaxy Jobs does not collect applications for
                        scholarships.
                    </p>
                </article>
                <aside className="grid content-start gap-4">
                    <div className="rounded-lg border bg-white p-5">
                        <h2 className="font-semibold">Scholarship overview</h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    Study level
                                </dt>
                                <dd>
                                    {scholarship.study_level ?? 'Not specified'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Funding
                                </dt>
                                <dd>
                                    {scholarship.funding_type ??
                                        'Not specified'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Deadline
                                </dt>
                                <dd>
                                    {scholarship.deadline
                                        ? formatDate(scholarship.deadline)
                                        : 'Open'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    {relatedScholarships.map((related) => (
                        <Link
                            key={related.id}
                            href={`/scholarships/${related.slug}`}
                            className="rounded-lg border bg-white p-4 text-sm transition hover:border-emerald-200"
                        >
                            <div className="font-medium text-slate-950">
                                {related.title}
                            </div>
                            <div className="mt-1 text-slate-500">
                                {related.deadline
                                    ? `Deadline ${formatDate(related.deadline)}`
                                    : related.provider}
                            </div>
                        </Link>
                    ))}
                </aside>
            </section>
        </PublicLayout>
    );
}

function Block({ title, body }: { title: string; body?: string | null }) {
    if (!body) {
        return null;
    }

    return (
        <section>
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="whitespace-pre-line text-slate-700">{body}</p>
        </section>
    );
}
