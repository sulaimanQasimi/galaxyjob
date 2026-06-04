import { Head, Link } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function SavedCompanies({ savedCompanies }: { savedCompanies: any }) {
    return <div className="p-6"><Head title="Saved companies" /><PageHeader title="Saved companies" description="Companies you follow for future jobs." /><TableShell page={savedCompanies} columns={['Company', 'Open jobs', 'Action']} render={(saved: any) => <><td className="px-4 py-3 font-medium">{saved.company?.name}</td><td className="px-4 py-3">{saved.company?.jobs_count ?? 0}</td><td className="px-4 py-3"><Button asChild size="sm"><Link href={`/companies/${saved.company?.slug}`}>View</Link></Button></td></>} /></div>;
}
