import { Badge } from '@/components/ui/badge';

const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    approved: 'bg-emerald-100 text-emerald-800',
    hired: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    reviewed: 'bg-sky-100 text-sky-800',
    shortlisted: 'bg-indigo-100 text-indigo-800',
    rejected: 'bg-rose-100 text-rose-800',
    inactive: 'bg-slate-200 text-slate-700',
    closed: 'bg-slate-200 text-slate-700',
};

export default function StatusBadge({ status }: { status: string }) {
    return <Badge className={colors[status] ?? ''}>{status.replaceAll('_', ' ')}</Badge>;
}
