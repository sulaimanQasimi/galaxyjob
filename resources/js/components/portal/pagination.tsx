import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/portal';

export default function Pagination({ page }: { page?: Paginated<unknown> | null }) {
    if (!page?.links || page.links.length <= 3) {
return null;
}

    return (
        <div className="flex flex-wrap gap-2">
            {page.links.map((link, index) => (
                <Button key={`${link.label}-${index}`} asChild={!!link.url} disabled={!link.url} variant={link.active ? 'default' : 'outline'} size="sm">
                    {link.url ? <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                </Button>
            ))}
        </div>
    );
}
