import { siteUrl } from '../data/site';
import { sitemapRoutes } from '../data/routes';

export const prerender = true;

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function GET() {
  const seen = new Set<string>();
  const uniqueRoutes = sitemapRoutes.filter((route) => {
    if (seen.has(route.path)) return false;
    seen.add(route.path);
    return true;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes
  .map((route) =>
    route.lastmod
      ? `  <url><loc>${escapeXml(`${siteUrl}${route.path}`)}</loc><lastmod>${escapeXml(route.lastmod)}</lastmod></url>`
      : `  <url><loc>${escapeXml(`${siteUrl}${route.path}`)}</loc></url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
