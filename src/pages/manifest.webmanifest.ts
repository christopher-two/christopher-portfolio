import { siteDescription, siteName, siteUrl } from '../data/site';

export const prerender = true;

export function GET() {
  return new Response(
    JSON.stringify({
      name: siteName,
      short_name: siteName,
      description: siteDescription,
      lang: 'es-MX',
      start_url: '/landing',
      scope: '/',
      display: 'browser',
      theme_color: '#f7f7f5',
      background_color: '#f7f7f5',
    }),
    {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    },
  );
}
