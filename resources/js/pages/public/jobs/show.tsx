import { Form, Link, usePage } from '@inertiajs/react';
import { Bookmark, Send } from 'lucide-react';
import JobCard from '@/components/portal/job-card';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import StatusBadge from '@/components/portal/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Job } from '@/types/portal';

export default function JobShow({
    job,
    hasApplied,
    isSaved,
    relatedJobs,
    seo,
}: {
    job: Job;
    hasApplied: boolean;
    isSaved: boolean;
    relatedJobs: Job[];
    seo: SeoData;
}) {
    const { auth } = usePage().props as any;
    const canApply = auth?.user?.role === 'employee';

    return (
        <PublicLayout>
            <SeoHead seo={seo} />
            <section className="border-b bg-white">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={job.job_type} />
                        <StatusBadge status={job.experience_level} />
                    </div>
                    <h1 className="text-3xl font-semibold">{job.title}</h1>
                    <p className="text-muted-foreground">
                        {job.company?.name} - {job.location?.name} - Deadline{' '}
                        {formatDate(job.deadline)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {canApply ? (
                            <>
                                <Form
                                    action={`/jobs/${job.id}/apply`}
                                    method="post"
                                    encType="multipart/form-data"
                                    className="grid gap-2 sm:min-w-96"
                                >
                                    <textarea
                                        name="cover_letter"
                                        placeholder="Short cover letter"
                                        className="min-h-24 rounded-md border bg-white px-3 py-2 text-sm"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <input
                                            name="cv_file"
                                            type="file"
                                            className="rounded-md border bg-white px-3 py-2 text-sm"
                                        />
                                        <Button disabled={hasApplied}>
                                            <Send className="size-4" />{' '}
                                            {hasApplied ? 'Applied' : 'Apply'}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        If no file is selected, your saved
                                        profile CV will be used when available.
                                    </p>
                                </Form>
                                <Form
                                    action={`/jobs/${job.id}/save`}
                                    method="post"
                                >
                                    <Button variant="outline">
                                        <Bookmark className="size-4" />{' '}
                                        {isSaved ? 'Unsave' : 'Save'}
                                    </Button>
                                </Form>
                            </>
                        ) : (
                            <Button asChild>
                                <Link href="/login">
                                    Login as jobseeker to apply
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
                <article className="grid gap-6 rounded-lg border bg-white p-6">
                    <Block title="Description" body={job.description} />
                    <Block
                        title="Responsibilities"
                        body={job.responsibilities}
                    />
                    <Block title="Requirements" body={job.requirements} />
                    <Block title="Benefits" body={job.benefits} />
                </article>
                <aside className="grid content-start gap-4">
                    <div className="rounded-lg border bg-white p-5">
                        <h2 className="font-semibold">Job overview</h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    Category
                                </dt>
                                <dd>{job.category?.name}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Salary
                                </dt>
                                <dd>
                                    {job.salary_min
                                        ? `${job.salary_min}-${job.salary_max} ${job.salary_currency}`
                                        : 'Negotiable'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Experience
                                </dt>
                                <dd>{job.experience_level}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Views</dt>
                                <dd>{job.views_count ?? 0}</dd>
                            </div>
                        </dl>
                    </div>
                    {relatedJobs.map((related) => (
                        <JobCard key={related.id} job={related} />
                    ))}
                </aside>
            </section>
        </PublicLayout>
    );
}

function Block({ title, body }: { title: string; body?: string }) {
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
