import { Head, Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import jobs from '@/routes/jobs';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Welcome" />
            <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-950">
                <section className="w-full max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex w-fit items-center justify-center gap-2">
                        <AppLogo />
                    </div>
                    <h1 className="text-3xl font-bold">Welcome to Galaxy Jobs</h1>
                    <p className="mt-3 text-slate-600">
                        Find verified jobs and trusted companies in one modern
                        job portal.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href={jobs.index.url()}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Browse jobs
                        </Link>
                        {auth.user ? (
                            <Link
                                href={dashboard.url()}
                                className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login.url()}
                                    className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={register.url()}
                                    className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
