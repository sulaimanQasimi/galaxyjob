import { Link } from '@inertiajs/react';
import { Briefcase, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/portal/status-badge';
import type { Job } from '@/types/portal';

export default function JobCard({ job }: { job: Job }) {
    return (
        <Card className="h-full rounded-lg">
            <CardContent className="grid gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <Link href={`/jobs/${job.slug}`} className="text-lg font-semibold hover:text-emerald-700">{job.title}</Link>
                        <p className="mt-1 text-sm text-muted-foreground">{job.company?.name}</p>
                    </div>
                    {job.is_featured && <StatusBadge status="featured" />}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="size-4" /> {job.location?.name}</span>
                    <span className="flex items-center gap-1"><Briefcase className="size-4" /> {job.job_type.replaceAll('_', ' ')}</span>
                </div>
                <div className="text-sm">{job.salary_min ? `${job.salary_min.toLocaleString()}-${job.salary_max?.toLocaleString()} ${job.salary_currency}` : 'Salary negotiable'}</div>
            </CardContent>
        </Card>
    );
}
