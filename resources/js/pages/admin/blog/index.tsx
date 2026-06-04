import { Form, Head } from '@inertiajs/react';
import { PageHeader, StatusBadge, TableShell } from '@/components/portal/admin-table';
import { Field, TextArea } from '@/components/portal/form-fields';
import { Button } from '@/components/ui/button';

export default function AdminBlog({ posts }: { posts: any }) {
    return <div className="grid gap-6 p-6"><Head title="Blog" /><PageHeader title="Blog / Career advice" description="Publish SEO career, scholarship, workplace, and hiring articles." /><PostForm action="/admin/blog" /><TableShell page={posts} columns={['Post', 'Category', 'Status', 'Edit']} render={(post: any) => <><td className="px-4 py-3 font-medium">{post.title}</td><td className="px-4 py-3">{post.category}</td><td className="px-4 py-3"><StatusBadge status={post.is_published ? 'published' : 'draft'} /></td><td className="px-4 py-3"><PostForm action={`/admin/blog/${post.id}`} method="patch" post={post} compact /></td></>} /></div>;
}

function PostForm({ action, method = 'post', post, compact = false }: { action: string; method?: 'post' | 'patch'; post?: any; compact?: boolean }) {
    return <Form action={action} method={method} className={`grid gap-3 rounded-lg border bg-card p-4 ${compact ? 'min-w-96' : 'md:grid-cols-4'}`}><Field label="Title" name="title" value={post?.title} /><Field label="Category" name="category" value={post?.category ?? 'Career Advice'} /><select name="language" defaultValue={post?.language ?? 'en'} className="rounded-md border bg-background px-3 py-2 text-sm"><option value="en">English</option><option value="fa">Dari</option><option value="ps">Pashto</option></select><Field label="Summary" name="summary" value={post?.summary} /><div className={compact ? '' : 'md:col-span-3'}><TextArea label="Body" name="body" value={post?.body} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" value="1" defaultChecked={post?.is_featured} /> Featured</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" value="1" defaultChecked={post?.is_published ?? true} /> Published</label><Button>{post ? 'Update' : 'Publish'}</Button></Form>;
}
