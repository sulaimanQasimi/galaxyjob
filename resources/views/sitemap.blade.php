<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach ($urls as $url)
    <url>
        <loc>{!! htmlspecialchars($url['loc'], ENT_XML1, 'UTF-8') !!}</loc>
        @isset($url['lastmod'])
            <lastmod>{{ $url['lastmod'] }}</lastmod>
        @endisset
        <changefreq>{{ $url['changefreq'] }}</changefreq>
        <priority>{{ $url['priority'] }}</priority>
    </url>
@endforeach
</urlset>
