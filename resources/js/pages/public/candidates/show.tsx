import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';

export default function CandidateShow({ profile, seo }: { profile: any; seo: SeoData }) {
    return <PublicLayout><SeoHead seo={seo} /><section className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-3xl font-semibold">{profile.user?.name}</h1><p className="mt-2 text-lg text-muted-foreground">{profile.headline}</p><div className="mt-6 rounded-lg border bg-white p-6"><h2 className="font-semibold">Profile</h2><p className="mt-3 whitespace-pre-line">{profile.summary}</p><div className="mt-4 text-sm text-muted-foreground">{profile.experience_years ?? 0} years experience - Expected salary {profile.expected_salary ?? 'Negotiable'}</div><div className="mt-4 flex flex-wrap gap-2">{profile.skills?.map((skill: any) => <span key={skill.id} className="rounded-md border px-2 py-1 text-sm">{skill.name}</span>)}</div></div></section></PublicLayout>;
}
