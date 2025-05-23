/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.gogendra.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/404', '/500', '/api/*', '/test-env/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.gogendra.com/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Add custom urls for dynamic routes
  additionalPaths: async (config) => {
    return [
      { loc: '/quote/metal-fabrication', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/quote/sheet-metal', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/quote/cnc-machining', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/quote/electronics-assembly', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { loc: '/quote/injection-molding', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
    ]
  },
}; 