import { Form, Head, router } from '@inertiajs/react';
import Pagination from '@/components/portal/pagination';
import { PageHeader } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Paginated, Skill } from '@/types/portal';

export default function CandidatesIndex({ candidates, filters, skills, notes }: { candidates: Paginated<any>; filters: any; skills: Skill[]; notes: Record<string, any[]> }) {
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get('/employer/candidates', Object.fromEntries(new FormData(event.currentTarget).entries()), { preserveState: true });
    }

    return (
        <div className="p-6">
            <Head title="Candidates" />
            <PageHeader title="Candidates" description="Find active jobseekers by skill, experience, location, and salary expectation." />
            <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-5">
                <Input name="search" placeholder="Headline, summary, location" defaultValue={filters.search ?? ''} />
                <select name="skill_id" defaultValue={filters.skill_id ?? ''} className="rounded-md border bg-background px-3 py-2 text-sm"><option value="">Skill</option>{skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}</select>
                <Input name="experience_min" type="number" placeholder="Min experience" defaultValue={filters.experience_min ?? ''} />
                <Input name="salary_max" type="number" placeholder="Max expected salary" defaultValue={filters.salary_max ?? ''} />
                <Button>Search</Button>
            </form>
            <section className="grid gap-4">
                {candidates.data.map((candidate) => (
                    <article key={candidate.id} className="rounded-lg border bg-card p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="font-semibold">{candidate.name}</h2>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">{candidate.employee_profile?.experience_years ?? 0} years - {candidate.employee_profile?.expected_salary ?? 'Negotiable'} AFN</div>
                        </div>
                        <div className="mt-3 rounded-md border px-3 py-2 text-xs"><span className="font-medium">{candidate.match_score ?? 0}% profile match</span><span className="text-muted-foreground"> {(candidate.match_reasons ?? []).join(' - ')}</span></div>
                        <p className="mt-3 font-medium">{candidate.employee_profile?.headline}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{candidate.employee_profile?.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">{candidate.employee_profile?.skills?.map((skill: Skill) => <span key={skill.id} className="rounded-md border px-2 py-1">{skill.name}</span>)}</div>
                        {candidate.employee_profile?.cv_file && <a className="mt-3 inline-block text-sm text-emerald-700" href={`/storage/${candidate.employee_profile.cv_file}`}>Open CV</a>}
                        <div className="mt-4 grid gap-2 rounded-md border p-3 text-sm">
                            <div className="font-medium">Private notes</div>
                            {(notes?.[candidate.id] ?? []).map((note: any) => <div key={note.id} className="text-muted-foreground">{note.note}</div>)}
                            <Form action={`/employer/candidates/${candidate.id}/notes`} method="post" className="grid gap-2">
                                <textarea name="note" placeholder="Add private note" className="min-h-16 rounded-md border bg-background px-3 py-2 text-sm" />
                                <Button size="sm" variant="outline">Save note</Button>
                            </Form>
                        </div>
                    </article>
                ))}
            </section>
            <div className="mt-6"><Pagination page={candidates} /></div>
        </div>
    );
}
