import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Database,
    Rocket,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import StatCard from '@/components/portal/stat-card';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';
import jobs from '@/routes/jobs';

type Stats = {
    jobs: number;
    companies: number;
    candidates: number;
    applications: number;
};

export default function About({ stats, seo }: { stats: Stats; seo: SeoData }) {
    return (
        <PublicLayout>
            <SeoHead seo={seo} />

            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <p className="font-semibold text-emerald-700">Galaxy Jobs</p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
                        About Our Platform
                    </h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                        Helping employers find talent and professionals find opportunities through a recruitment and career platform developed and operated by Galaxy Technology.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 py-14">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-950">Galaxy Technology behind the platform</h2>
                        <p className="mt-4 leading-8 text-slate-600">
                            Galaxy Technology provides software development, web applications, mobile applications, databases, and IT solutions. The company brings that technical foundation into Galaxy Jobs to create a modern hiring experience.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {['Software development', 'Web applications', 'Mobile applications', 'Database solutions'].map((item) => (
                            <div key={item} className="rounded-xl border bg-white p-5 shadow-sm">
                                <Database className="size-5 text-emerald-700" />
                                <h3 className="mt-4 font-semibold">{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-14">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2">
                    <InfoCard title="Mission" icon={Rocket}>
                        Connect talented professionals with employers, simplify hiring, support career growth, and create opportunities across industries.
                    </InfoCard>
                    <InfoCard title="Vision" icon={Building2}>
                        Become a leading employment platform in Afghanistan and internationally.
                    </InfoCard>
                </div>
            </section>

            <section className="bg-slate-50 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <h2 className="text-3xl font-bold text-slate-950">Why choose us</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {['Verified employers', 'Easy job applications', 'Professional company profiles', 'Fast hiring process', 'Modern technology'].map((item) => (
                            <div key={item} className="rounded-xl border bg-white p-5 shadow-sm">
                                <CheckCircle2 className="size-5 text-emerald-700" />
                                <h3 className="mt-4 font-semibold">{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-14">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Open jobs" value={stats.jobs} icon={BriefcaseBusiness} />
                    <StatCard label="Companies" value={stats.companies} icon={Building2} tone="sky" />
                    <StatCard label="Candidates" value={stats.candidates} icon={Users} tone="amber" />
                    <StatCard label="Applications" value={stats.applications} icon={CheckCircle2} tone="rose" />
                </div>
            </section>

            <section className="bg-emerald-50 py-14">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-950">Start with Galaxy Jobs today</h2>
                        <p className="mt-2 text-slate-600">Find your next job or start hiring with a modern recruitment platform.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild><Link href={jobs.index.url()}>Find Jobs</Link></Button>
                        <Button asChild variant="outline"><Link href={register.url({ query: { role: 'employer' } })}>Post Jobs</Link></Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: typeof Rocket; children: ReactNode }) {
    return (
        <article className="rounded-2xl border bg-white p-6 shadow-sm">
            <Icon className="size-6 text-emerald-700" />
            <h2 className="mt-5 text-2xl font-bold">{title}</h2>
            <p className="mt-3 leading-8 text-slate-600">{children}</p>
        </article>
    );
}
