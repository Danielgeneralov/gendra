/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  webpack: (config, { isServer }) => {
    // Add support for PDF.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Explicitly add path aliases
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['@/lib'] = path.join(__dirname, 'src/lib');
    
    // Fix issues with PDF.js in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        util: false,
        crypto: false,
        worker_threads: false,
        os: false,
      };
    }
    
    return config;
  },
  // Allow loading scripts from CDN
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*;"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 