import { Link } from '@inertiajs/react';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';

export default function BlogShow({ post, relatedPosts, seo }: { post: any; relatedPosts: any[]; seo: SeoData }) {
    return <PublicLayout><SeoHead seo={seo} /><article className="mx-auto max-w-3xl px-4 py-10"><div className="text-sm font-medium text-emerald-700">{post.category}</div><h1 className="mt-2 text-3xl font-semibold">{post.title}</h1><p className="mt-4 text-muted-foreground">{post.summary}</p><div className="mt-8 whitespace-pre-line leading-8">{post.body}</div></article><aside className="mx-auto max-w-3xl px-4 pb-10"><h2 className="font-semibold">Related articles</h2><div className="mt-3 grid gap-2">{relatedPosts.map((item) => <Link key={item.id} className="rounded-md border bg-white p-3" href={`/blog/${item.slug}`}>{item.title}</Link>)}</div></aside></PublicLayout>;
}
