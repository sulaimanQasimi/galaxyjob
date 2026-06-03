import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileText,
    Send,
    UserPlus,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CategoryCard from '@/components/portal/category-card';
import CompanyCard from '@/components/portal/company-card';
import JobCard from '@/components/portal/job-card';
import PublicLayout from '@/components/portal/public-layout';
import SearchHero from '@/components/portal/search-hero';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import StatCard from '@/components/portal/stat-card';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';
import jobs from '@/routes/jobs';
import type { Category, Company, Job, Location } from '@/types/portal';

type HomeStats = {
    jobs?: number;
    companies?: number;
    candidates?: number;
    applications?: number;
};

type LiveHomeData = {
    stats: HomeStats;
    featured_jobs: Job[];
    featured_companies: Company[];
    categories: Category[];
};

export default function Home({
    stats,
    featuredJobs,
    latestJobs,
    categories,
    locations,
    topCompanies = [],
    seo,
}: {
    stats: HomeStats;
    featuredJobs: Job[];
    latestJobs: Job[];
    categories: Category[];
    locations: Location[];
    topCompanies?: Company[];
    seo: SeoData;
}) {
    const [liveData, setLiveData] = useState<LiveHomeData>({
        stats,
        featured_jobs: featuredJobs.length ? featuredJobs : latestJobs,
        featured_companies: topCompanies,
        categories,
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);

    const refreshHomepage = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setIsRefreshing(true);
        }

        try {
            const response = await fetch('/api/homepage/live', {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Unable to refresh homepage data.');
            }

            setLiveData(await response.json());
            setRefreshError(null);
        } catch (error) {
            setRefreshError(
                error instanceof Error
                    ? error.message
                    : 'Unable to refresh homepage data.',
            );
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            void refreshHomepage(false);
        }, 45_000);

        return () => window.clearInterval(interval);
    }, [refreshHomepage]);

    const visibleFeaturedJobs = useMemo(
        () => liveData.featured_jobs,
        [liveData.featured_jobs],
    );
    const visibleCompanies = liveData.featured_companies;
    const visibleCategories = liveData.categories;

    return (
        <PublicLayout>
            <SeoHead seo={seo} />

            <SearchHero
                locations={locations}
                highlightedJobs={visibleFeaturedJobs}
            />

            <section className="bg-slate-50 py-10" aria-live="polite">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Open jobs"
                        value={
                            liveData.stats.jobs ?? visibleFeaturedJobs.length
                        }
                        icon={BriefcaseBusiness}
                        tone="emerald"
                    />
                    <StatCard
                        label="Companies"
                        value={
                            liveData.stats.companies ?? visibleCompanies.length
                        }
                        icon={Building2}
                        tone="sky"
                    />
                    <StatCard
                        label="Candidates"
                        value={liveData.stats.candidates ?? 0}
                        icon={Users}
                        tone="amber"
                    />
                    <StatCard
                        label="Applications"
                        value={liveData.stats.applications ?? 0}
                        icon={FileText}
                        tone="rose"
                    />
                </div>
                <LiveStatus
                    isRefreshing={isRefreshing}
                    error={refreshError}
                    onRetry={() => void refreshHomepage()}
                />
            </section>

            <section className="bg-white py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Explore by field"
                        title="Featured categories"
                        description="Browse hiring areas with active opportunities and verified employers."
                        action={
                            <Button asChild variant="outline">
                                <Link href={jobs.index.url()}>
                                    Browse all jobs
                                </Link>
                            </Button>
                        }
                    />
                    {isRefreshing && <SectionSkeleton />}
                    {visibleCategories.length ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {visibleCategories.map((category, index) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState text="Categories will appear once the admin publishes them." />
                    )}
                </div>
            </section>

            <section className="bg-slate-50 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Curated roles"
                        title="Featured jobs"
                        description="Premium listings from employers currently hiring."
                        action={
                            <Button asChild>
                                <Link href={jobs.index.url()}>
                                    View all jobs
                                </Link>
                            </Button>
                        }
                    />
                    {isRefreshing && <SectionSkeleton />}
                    {visibleFeaturedJobs.length ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {visibleFeaturedJobs.slice(0, 6).map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState text="Featured jobs will appear here as employers publish approved listings." />
                    )}
                </div>
            </section>

            <section className="bg-white py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Trusted employers"
                        title="Top companies"
                        description="Discover companies with active jobs and growing teams."
                    />
                    {isRefreshing && <SectionSkeleton />}
                    {visibleCompanies.length ? (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {visibleCompanies.map((company) => (
                                <CompanyCard
                                    key={company.id}
                                    company={company}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState text="Approved companies with open jobs will appear here." />
                    )}
                </div>
            </section>

            <section className="bg-slate-950 py-14 text-white">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Simple workflow"
                        title="How GalaxyJob works"
                        description="A clear path for jobseekers and employers from first step to final decision."
                        dark
                    />
                    <div className="grid gap-5 md:grid-cols-3">
                        <StepCard
                            icon={UserPlus}
                            step="01"
                            title="Create account"
                            text="Register as a jobseeker or employer and access the right dashboard."
                        />
                        <StepCard
                            icon={FileText}
                            step="02"
                            title="Build profile or post job"
                            text="Jobseekers add resume details. Employers submit company profiles and jobs."
                        />
                        <StepCard
                            icon={CheckCircle2}
                            step="03"
                            title="Apply or hire"
                            text="Apply to active jobs, review applicants, and move candidates through statuses."
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white py-14">
                <div className="mx-auto grid max-w-7xl gap-5 px-4 lg:grid-cols-2">
                    <CtaCard
                        title="Ready for your next role?"
                        text="Search active opportunities and apply with your profile or uploaded CV."
                        href={jobs.index.url()}
                        button="Find jobs"
                        icon={Send}
                    />
                    <CtaCard
                        title="Hiring for your team?"
                        text="Create an employer account, complete your company profile, and submit jobs for approval."
                        href={register.url({ query: { role: 'employer' } })}
                        button="Post a job"
                        icon={BriefcaseBusiness}
                    />
                </div>
            </section>
        </PublicLayout>
    );
}

function SectionHeader({
    eyebrow,
    title,
    description,
    action,
    dark = false,
}: {
    eyebrow: string;
    title: string;
    description: string;
    action?: React.ReactNode;
    dark?: boolean;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <p
                    className={`text-sm font-semibold tracking-wide uppercase ${
                        dark ? 'text-emerald-300' : 'text-emerald-700'
                    }`}
                >
                    {eyebrow}
                </p>
                <h2
                    className={`mt-2 text-3xl font-bold tracking-tight ${
                        dark ? 'text-white' : 'text-slate-950'
                    }`}
                >
                    {title}
                </h2>
                <p
                    className={`mt-3 max-w-2xl text-base leading-7 ${
                        dark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                >
                    {description}
                </p>
            </div>
            {action}
        </div>
    );
}

function StepCard({
    icon: Icon,
    step,
    title,
    text,
}: {
    icon: typeof UserPlus;
    step: string;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 transition duration-200 hover:-translate-y-1 hover:bg-white/15">
            <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
                    <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-slate-400">
                    {step}
                </span>
            </div>
            <h3 className="mt-6 text-xl font-semibold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-300">{text}</p>
        </div>
    );
}

function CtaCard({
    title,
    text,
    href,
    button,
    icon: Icon,
}: {
    title: string;
    text: string;
    href: string;
    button: string;
    icon: typeof Send;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-slate-950">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{text}</p>
            <Button asChild className="mt-6">
                <Link href={href}>{button}</Link>
            </Button>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            {text}
        </div>
    );
}

function LiveStatus({
    isRefreshing,
    error,
    onRetry,
}: {
    isRefreshing: boolean;
    error: string | null;
    onRetry: () => void;
}) {
    if (!isRefreshing && !error) {
        return null;
    }

    return (
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-3 px-4 text-sm">
            {isRefreshing ? (
                <span className="rounded-full bg-white px-3 py-1 text-slate-500 shadow-sm">
                    Refreshing live homepage data...
                </span>
            ) : (
                <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700 ring-1 ring-rose-100">
                    {error}
                </span>
            )}
            {error && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                    Retry
                </button>
            )}
        </div>
    );
}

function SectionSkeleton() {
    return (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="h-28 animate-pulse rounded-xl bg-slate-200/70"
                />
            ))}
        </div>
    );
}
