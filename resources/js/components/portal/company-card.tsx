import { Link } from '@inertiajs/react';
import { ArrowRight, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import companies from '@/routes/companies';
import type { Company } from '@/types/portal';

export default function CompanyCard({ company }: { company: Company }) {
    return (
        <article>
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                <CardContent className="grid gap-4 p-5">
                    <div className="flex items-center gap-3">
                        <CompanyLogo name={company.name} logo={company.logo} />
                        <div className="min-w-0">
                            <Link
                                href={companies.show.url(company)}
                                className="truncate font-semibold text-slate-950 transition hover:text-emerald-700"
                            >
                                {company.name}
                            </Link>
                            <p className="text-sm text-slate-500">
                                {company.industry || 'Employer'}
                            </p>
                        </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                        {company.description ||
                            'Verified hiring team on Galaxy Jobs.'}
                    </p>
                    <div className="flex items-center justify-between border-t pt-4 text-sm">
                        <span className="font-semibold text-slate-950">
                            {(company.jobs_count ?? 0).toLocaleString()} open
                            jobs
                        </span>
                        <Link
                            href={companies.show.url(company)}
                            className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800"
                        >
                            View
                            <ArrowRight className="size-4" />
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
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            <Building2 className="size-5" aria-hidden="true" />
        </span>
    );
}
