import { Form, Head, usePage } from '@inertiajs/react';
import JobCard from '@/components/portal/job-card';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import { Button } from '@/components/ui/button';
import type { Company, Job, Paginated } from '@/types/portal';

export default function CompanyShow({ company, jobs, reviews, canReview }: { company: Company; jobs: Paginated<Job>; reviews: any[]; canReview: boolean }) {
    const { auth } = usePage().props as any;

    return (
        <PublicLayout>
            <Head title={company.name} />
            <section className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <h1 className="text-3xl font-semibold">{company.name}</h1>
                    <p className="mt-2 text-muted-foreground">{company.industry} - {company.address}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>Verified employer</span>
                        {company.company_size && <span>{company.company_size} employees</span>}
                        <span>{company.rating_avg ? `${company.rating_avg}/5 rating` : 'No ratings yet'}</span>
                        <span>{company.reviews_count ?? 0} reviews</span>
                    </div>
                    <p className="mt-4 max-w-3xl">{company.description}</p>
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
                <div>
                    <h2 className="mb-5 text-2xl font-semibold">Open jobs</h2>
                    <div className="grid gap-4 md:grid-cols-2">{jobs.data.map((job) => <JobCard key={job.id} job={{ ...job, company }} />)}</div>
                    <div className="mt-6"><Pagination page={jobs} /></div>
                </div>
                <aside className="grid content-start gap-4">
                    {canReview && auth?.user?.role === 'employee' && (
                        <Form action={`/companies/${company.id}/reviews`} method="post" className="grid gap-3 rounded-lg border bg-white p-5">
                            <h2 className="font-semibold">Review company</h2>
                            <select name="rating" defaultValue="5" className="rounded-md border bg-background px-3 py-2 text-sm"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select>
                            <input name="title" placeholder="Title" className="rounded-md border bg-background px-3 py-2 text-sm" />
                            <textarea name="body" placeholder="Share your experience" className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm" />
                            <Button>Save review</Button>
                        </Form>
                    )}
                    <div className="grid gap-3">
                        <h2 className="font-semibold">Reviews</h2>
                        {reviews.length ? reviews.map((review) => <article key={review.id} className="rounded-lg border bg-white p-4"><div className="font-medium">{review.rating}/5 - {review.title}</div><p className="mt-1 text-sm text-muted-foreground">{review.body}</p><div className="mt-2 text-xs text-muted-foreground">{review.user?.name}</div></article>) : <p className="rounded-lg border bg-white p-4 text-sm text-muted-foreground">No company reviews yet.</p>}
                    </div>
                </aside>
            </section>
        </PublicLayout>
    );
}
