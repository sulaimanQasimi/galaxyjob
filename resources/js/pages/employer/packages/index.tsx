import { Form, Head } from '@inertiajs/react';
import {
    PageHeader,
    StatusBadge,
    TableShell,
} from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default function EmployerPackages({
    packages,
    payments,
    subscription,
}: {
    packages: any[];
    payments: any;
    subscription?: any;
}) {
    return (
        <div className="grid gap-6 p-6">
            <Head title="Employer packages" />
            <PageHeader
                title="Employer packages"
                description="Choose a package and submit your payment reference for admin approval."
            />
            {subscription && (
                <section className="rounded-lg border bg-card p-4 text-sm">
                    <span className="font-medium">Active:</span>{' '}
                    {subscription.package?.name} until{' '}
                    {formatDate(subscription.ends_at)}. Jobs{' '}
                    {subscription.job_posts_used}/
                    {subscription.package?.job_posts}, featured{' '}
                    {subscription.featured_posts_used}/
                    {subscription.package?.featured_posts}
                </section>
            )}
            <section className="grid gap-4 md:grid-cols-3">
                {packages.map((pkg) => (
                    <article
                        key={pkg.id}
                        className="rounded-lg border bg-card p-5"
                    >
                        <h2 className="font-semibold">{pkg.name}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {pkg.description}
                        </p>
                        <div className="mt-4 text-2xl font-semibold">
                            {pkg.price} {pkg.currency}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            {pkg.job_posts} jobs - {pkg.featured_posts} featured
                            - {pkg.duration_days} days
                        </div>
                        <Form
                            action="/employer/payments"
                            method="post"
                            className="mt-4 grid gap-2"
                        >
                            <input
                                type="hidden"
                                name="employer_package_id"
                                value={pkg.id}
                            />
                            <input
                                name="reference"
                                placeholder="Payment reference"
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                            />
                            <textarea
                                name="notes"
                                placeholder="Payment notes"
                                className="min-h-20 rounded-md border bg-background px-3 py-2 text-sm"
                            />
                            <Button>Submit payment</Button>
                        </Form>
                    </article>
                ))}
            </section>
            <section>
                <h2 className="mb-3 font-semibold">Payment history</h2>
                <TableShell
                    page={payments}
                    columns={['Package', 'Amount', 'Reference', 'Status']}
                    render={(payment: any) => (
                        <>
                            <td className="px-4 py-3">
                                {payment.package?.name}
                            </td>
                            <td className="px-4 py-3">
                                {payment.amount} {payment.currency}
                            </td>
                            <td className="px-4 py-3">
                                {payment.reference ?? 'Not provided'}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={payment.status} />
                            </td>
                        </>
                    )}
                />
            </section>
        </div>
    );
}
