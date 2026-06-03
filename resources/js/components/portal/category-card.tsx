import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building,
    Calculator,
    GraduationCap,
    HeartPulse,
    Headphones,
    LineChart,
    Megaphone,
    Palette,
    Settings,
} from 'lucide-react';
import jobs from '@/routes/jobs';
import type { Category } from '@/types/portal';

const icons = [
    BriefcaseBusiness,
    Building,
    Calculator,
    GraduationCap,
    HeartPulse,
    Headphones,
    LineChart,
    Megaphone,
    Palette,
    Settings,
];

export default function CategoryCard({
    category,
    index,
}: {
    category: Category;
    index: number;
}) {
    const Icon = icons[index % icons.length];

    return (
        <article>
            <Link
                href={jobs.index.url({ query: { category_id: category.id } })}
                className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
            <span
                className="mb-5 flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-emerald-600 group-hover:text-white"
                aria-hidden="true"
            >
                <Icon className="size-5" />
            </span>
            <div className="font-semibold text-slate-950">{category.name}</div>
            <div className="mt-1 text-sm text-slate-500">
                {(category.jobs_count ?? 0).toLocaleString()} open jobs
            </div>
            </Link>
        </article>
    );
}
