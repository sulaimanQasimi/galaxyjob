import type { LucideIcon } from 'lucide-react';

export default function StatCard({
    label,
    value,
    icon: Icon,
    tone = 'emerald',
}: {
    label: string;
    value: number;
    icon: LucideIcon;
    tone?: 'emerald' | 'sky' | 'amber' | 'rose';
}) {
    const tones = {
        emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        sky: 'bg-sky-50 text-sky-700 ring-sky-100',
        amber: 'bg-amber-50 text-amber-700 ring-amber-100',
        rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    };

    return (
        <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="text-2xl font-bold text-slate-950 md:text-3xl">
                        {value.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-500">
                        {label}
                    </div>
                </div>
                <span
                    className={`flex size-12 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}
                    aria-hidden="true"
                >
                    <Icon className="size-5" />
                </span>
            </div>
        </div>
    );
}
