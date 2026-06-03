import { Link, usePage } from '@inertiajs/react';
import { Briefcase, LayoutDashboard, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-white">
                            <Briefcase className="size-5" />
                        </span>
                        GalaxyJob
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        <Link href="/jobs">Jobs</Link>
                        <Link href="/companies">Companies</Link>
                    </nav>
                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href="/dashboard"><LayoutDashboard className="size-4" /> Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login"><LogIn className="size-4" /> Login</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}
