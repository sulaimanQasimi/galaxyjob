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
    const currentYear = new Date().getFullYear();

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
                        Galaxy Jobs
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        <Link href={home.url()}>Home</Link>
                        <Link href={jobs.index.url()}>Jobs</Link>
                        <Link href="/scholarships">Scholarships</Link>
                        <Link href={companies.index.url()}>Companies</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
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

            <footer className="border-t bg-white text-slate-600">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-slate-950">
                            <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600">
                                <Briefcase className="size-5 text-white" />
                            </span>
                            Galaxy Jobs
                        </div>
                        <h2 className="mt-5 font-semibold text-slate-950">
                            About Galaxy Technology
                        </h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                            Galaxy Jobs is a recruitment and career platform
                            operated by Galaxy Technology, the software and IT
                            company behind the platform.
                        </p>
                        <p className="mt-4 text-sm text-slate-500">
                            &copy; {currentYear} Galaxy Jobs. Powered by Galaxy
                            Technology.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-950">
                            Quick Links
                        </h2>
                        <div className="mt-3 grid gap-2 text-sm">
                            <Link
                                href={home.url()}
                                className="hover:text-emerald-700"
                            >
                                Home
                            </Link>
                            <Link
                                href={jobs.index.url()}
                                className="hover:text-emerald-700"
                            >
                                Jobs
                            </Link>
                            <Link
                                href="/scholarships"
                                className="hover:text-emerald-700"
                            >
                                Scholarships
                            </Link>
                            <Link
                                href={companies.index.url()}
                                className="hover:text-emerald-700"
                            >
                                Companies
                            </Link>
                            <Link
                                href="/about"
                                className="hover:text-emerald-700"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="hover:text-emerald-700"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-950">
                            Contact Information
                        </h2>
                        <div className="mt-3 grid gap-2 text-sm">
                            <a
                                href="mailto:info@galaxytechology.com"
                                className="hover:text-emerald-700"
                            >
                                info@galaxytechology.com
                            </a>
                            <a
                                href="tel:+93797548234"
                                className="hover:text-emerald-700"
                            >
                                +93 797 548 234
                            </a>
                            <span>
                                Mazar Sharif, Muzafar Market, Afghanistan
                            </span>
                        </div>
                        <h2 className="mt-6 font-semibold text-slate-950">
                            Social Links
                        </h2>
                        <div className="mt-3 flex gap-3 text-sm">
                            {['Facebook', 'LinkedIn', 'X'].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border px-3 py-1 text-slate-500"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
