import { Link, usePage } from '@inertiajs/react';
import { Briefcase, LayoutDashboard, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, home, login, register } from '@/routes';
import companies from '@/routes/companies';
import jobs from '@/routes/jobs';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link
                        href={home.url()}
                        className="flex items-center gap-2 font-semibold"
                    >
                        <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-white">
                            <Briefcase className="size-5" />
                        </span>
                        GalaxyJob
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        <Link href={jobs.index.url()}>Jobs</Link>
                        <Link href={companies.index.url()}>Companies</Link>
                    </nav>
                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href={dashboard.url()}>
                                    <LayoutDashboard className="size-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={login.url()}>
                                        <LogIn className="size-4" />
                                        Login
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register.url()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main>{children}</main>
            <footer className="border-t bg-slate-950 text-slate-300">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-white">
                            <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600">
                                <Briefcase className="size-5" />
                            </span>
                            GalaxyJob
                        </div>
                        <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                            A modern job marketplace for verified employers and
                            ambitious candidates.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Explore</h2>
                        <div className="mt-3 grid gap-2 text-sm">
                            <Link
                                href={jobs.index.url()}
                                className="hover:text-white"
                            >
                                Jobs
                            </Link>
                            <Link
                                href={companies.index.url()}
                                className="hover:text-white"
                            >
                                Companies
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Account</h2>
                        <div className="mt-3 grid gap-2 text-sm">
                            <Link
                                href={login.url()}
                                className="hover:text-white"
                            >
                                Login
                            </Link>
                            <Link
                                href={register.url()}
                                className="hover:text-white"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
