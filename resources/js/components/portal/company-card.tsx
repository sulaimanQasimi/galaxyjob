import { Link } from '@inertiajs/react';
import { Building2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Company } from '@/types/portal';

export default function CompanyCard({ company }: { company: Company }) {
    return (
        <Card className="rounded-lg">
            <CardContent className="grid gap-3 p-5">
                <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-700"><Building2 /></span>
                    <div>
                        <Link href={`/companies/${company.slug}`} className="font-semibold hover:text-emerald-700">{company.name}</Link>
                        <p className="text-sm text-muted-foreground">{company.industry || 'Employer'}</p>
                    </div>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{company.description || 'Hiring team on GalaxyJob.'}</p>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-4" /> {company.address || 'Afghanistan'}</span>
                    <span>{company.jobs_count ?? 0} jobs</span>
                </div>
            </CardContent>
        </Card>
    );
}
