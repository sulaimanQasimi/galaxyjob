import { Head, usePage } from '@inertiajs/react';
import JsonLd from '@/components/portal/json-ld';

export type SeoData = {
    title: string;
    description: string;
    keywords?: string;
    canonical: string;
    image: string;
    type?: string;
    robots?: string;
    jsonLd?: unknown[];
};

export default function SeoHead({ seo }: { seo: SeoData }) {
    const { appUrl } = usePage().props as { appUrl?: string };
    const canonical = absoluteUrl(seo.canonical, appUrl);
    const image = absoluteUrl(seo.image, appUrl);

    return (
        <Head title={seo.title}>
            <meta
                head-key="description"
                name="description"
                content={seo.description}
            />
            {seo.keywords && (
                <meta
                    head-key="keywords"
                    name="keywords"
                    content={seo.keywords}
                />
            )}
            <meta
                head-key="robots"
                name="robots"
                content={seo.robots ?? 'index, follow'}
            />
            <link head-key="canonical" rel="canonical" href={canonical} />
            <meta head-key="og:title" property="og:title" content={seo.title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={seo.description}
            />
            <meta head-key="og:image" property="og:image" content={image} />
            <meta head-key="og:url" property="og:url" content={canonical} />
            <meta
                head-key="og:type"
                property="og:type"
                content={seo.type ?? 'website'}
            />
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={seo.title}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={seo.description}
            />
            <meta
                head-key="twitter:image"
                name="twitter:image"
                content={image}
            />
            {(seo.jsonLd ?? []).map((item, index) => (
                <JsonLd key={index} id={`json-ld-${index}`} data={item} />
            ))}
        </Head>
    );
}

function absoluteUrl(url: string, appUrl?: string) {
    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    return `${appUrl?.replace(/\/$/, '') ?? ''}/${url.replace(/^\//, '')}`;
}
