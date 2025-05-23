import { MetadataRoute } from 'next';

// Define the base URL
const BASE_URL = 'https://www.gogendra.com';

// Define the current date for lastmod
const CURRENT_DATE = new Date().toISOString();

export async function GET(): Promise<Response> {
  // Define static routes
  const staticRoutes = [
    '',
    '/quote',
    '/schedule',
    '/dashboard',
    '/pricing',
    '/faq',
    '/products',
  ];

  // Define dynamic industry routes
  const industryRoutes = [
    '/quote/metal-fabrication',
    '/quote/sheet-metal',
    '/quote/cnc-machining',
    '/quote/injection-molding',
    '/quote/electronics-assembly',
  ];

  // Generate XML content
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `<url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </url>`
    )
    .join('\n  ')}
  ${industryRoutes
    .map(
      (route) => `<url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </url>`
    )
    .join('\n  ')}
</urlset>`;

  // Return the XML with appropriate content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 