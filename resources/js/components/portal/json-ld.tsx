export default function JsonLd({
    data,
    id = 'json-ld',
}: {
    data: unknown;
    id?: string;
}) {
    return (
        <script
            type="application/ld+json"
            head-key={id}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
