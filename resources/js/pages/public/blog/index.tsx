import { Link, router } from '@inertiajs/react';
import Pagination from '@/components/portal/pagination';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Paginated } from '@/types/portal';

export default function BlogIndex({ posts, filters, categories, seo }: { posts: Paginated<any>; filters: any; categories: string[]; seo: SeoData }) {
    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); router.get('/blog', Object.fromEntries(new FormData(event.currentTarget).entries()), { preserveState: true }); }
    return <PublicLayout><SeoHead seo={seo} /><section className="border-b bg-white"><div className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-semibold">Career advice</h1><form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-4"><Input name="search" placeholder="Search articles" defaultValue={filters.search ?? ''} /><select name="category" defaultValue={filters.category ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Category</option>{categories.map((c) => <option key={c}>{c}</option>)}</select><select name="language" defaultValue={filters.language ?? ''} className="rounded-md border bg-white px-3 py-2 text-sm"><option value="">Language</option><option value="en">English</option><option value="fa">Dari</option><option value="ps">Pashto</option></select><Button>Filter</Button></form></div></section><section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">{posts.data.map((post) => <article key={post.id} className="rounded-lg border bg-white p-5"><div className="text-sm text-emerald-700">{post.category}</div><h2 className="mt-2 font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-2 text-sm text-muted-foreground">{post.summary}</p></article>)}</section><div className="mx-auto max-w-7xl px-4 pb-10"><Pagination page={posts} /></div></PublicLayout>;
}
