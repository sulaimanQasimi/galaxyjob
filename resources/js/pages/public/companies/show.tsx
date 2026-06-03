import { Head } from '@inertiajs/react';
import JobCard from '@/components/portal/job-card';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import type { Company, Job, Paginated } from '@/types/portal';

export default function CompanyShow({ company, jobs }: { company: Company; jobs: Paginated<Job> }) {
    return (
        <PublicLayout>
            <Head title={company.name} />
            <section className="border-b bg-white"><div className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold">{company.name}</h1><p className="mt-2 text-muted-foreground">{company.industry} • {company.address}</p><p className="mt-4 max-w-3xl">{company.description}</p></div></section>
            <section className="mx-auto max-w-7xl px-4 py-8"><h2 className="mb-5 text-2xl font-semibold">Open jobs</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{jobs.data.map((job) => <JobCard key={job.id} job={{ ...job, company }} />)}</div><div className="mt-6"><Pagination page={jobs} /></div></section>
        </PublicLayout>
    );
}
