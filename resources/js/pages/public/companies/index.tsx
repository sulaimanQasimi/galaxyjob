import { router } from '@inertiajs/react';
import CompanyCard from '@/components/portal/company-card';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Company, Paginated } from '@/types/portal';

export default function CompaniesIndex({ companies, filters, seo }: { companies: Paginated<Company>; filters: any; seo: SeoData }) {
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get('/companies', Object.fromEntries(new FormData(event.currentTarget).entries()), { preserveState: true });
    }

    return (
        <PublicLayout>
            <SeoHead seo={seo} />
            <div className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="text-3xl font-semibold">Companies</h1>
                <form onSubmit={submit} className="mt-5 flex gap-2"><Input name="search" defaultValue={filters.search ?? ''} placeholder="Search companies" /><Button>Search</Button></form>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{companies.data.map((company) => <CompanyCard key={company.id} company={company} />)}</div>
                <div className="mt-6"><Pagination page={companies} /></div>
            </div>
        </PublicLayout>
    );
}
