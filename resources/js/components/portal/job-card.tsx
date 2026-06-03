import { Link } from '@inertiajs/react';
import {
    Briefcase,
    CalendarClock,
    CircleDollarSign,
    MapPin,
} from 'lucide-react';
import StatusBadge from '@/components/portal/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import jobs from '@/routes/jobs';
import type { Job } from '@/types/portal';

export default function JobCard({ job }: { job: Job }) {
    const salary = job.salary_min
        ? `${job.salary_min.toLocaleString()}-${job.salary_max?.toLocaleString()} ${job.salary_currency}`
        : 'Salary negotiable';

    return (
        <article className="h-full">
            <Card className="h-full rounded-xl border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                <CardContent className="flex h-full flex-col gap-5 p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                            <CompanyLogo
                                name={job.company?.name ?? 'Company'}
                                logo={job.company?.logo}
                            />
                            <div className="min-w-0">
                                <Link
                                    href={jobs.show.url(job)}
                                    className="line-clamp-2 text-lg font-semibold text-slate-950 transition hover:text-emerald-700"
                                >
                                    {job.title}
                                </Link>
                                <p className="mt-1 truncate text-sm text-slate-500">
                                    {job.company?.name ?? 'Verified employer'}
                                </p>
                            </div>
                        </div>
                        {job.is_featured && <StatusBadge status="featured" />}
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                            <MapPin className="size-4 text-slate-400" />
                            {job.location?.name ?? 'Flexible'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Briefcase className="size-4 text-slate-400" />
                            {job.job_type.replaceAll('_', ' ')}
                        </span>
                        <span className="flex items-center gap-2">
                            <CircleDollarSign className="size-4 text-slate-400" />
                            {salary}
                        </span>
                        <span className="flex items-center gap-2">
                            <CalendarClock className="size-4 text-slate-400" />
                            Deadline {job.deadline}
                        </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 capitalize">
                            {job.experience_level}
                        </span>
                        <Link
                            href={jobs.show.url(job)}
                            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                        >
                            View details
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </article>
    );
}

function CompanyLogo({ name, logo }: { name: string; logo?: string | null }) {
    if (logo) {
        return (
            <img
                src={`/storage/${logo}`}
                alt={`${name} logo`}
                loading="lazy"
                className="size-12 rounded-lg object-cover ring-1 ring-slate-200"
            />
        );
    }

    return (
        <span
            className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base font-bold text-emerald-700 ring-1 ring-emerald-100"
            aria-hidden="true"
        >
            {name.slice(0, 2).toUpperCase()}
        </span>
    );
}
