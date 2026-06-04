import { Head, Link } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default function SavedJobs({ savedJobs }: { savedJobs: any }) {
    return (
        <div className="p-6">
            <Head title="Saved jobs" />
            <PageHeader title="Saved jobs" />
            <TableShell
                page={savedJobs}
                columns={['Job', 'Company', 'Deadline', 'Action']}
                render={(saved: any) => (
                    <>
                        <td className="px-4 py-3 font-medium">
                            {saved.job?.title}
                        </td>
                        <td className="px-4 py-3">
                            {saved.job?.company?.name}
                        </td>
                        <td className="px-4 py-3">
                            {formatDate(saved.job?.deadline)}
                        </td>
                        <td className="px-4 py-3">
                            <Button asChild size="sm">
                                <Link href={`/jobs/${saved.job?.slug}`}>
                                    View
                                </Link>
                            </Button>
                        </td>
                    </>
                )}
            />
        </div>
    );
}
