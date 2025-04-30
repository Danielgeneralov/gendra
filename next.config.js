/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add configurations as needed
  
  // Only disable TypeScript type checking during development
  typescript: {
    // Enable type checking in production, disable in development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Only disable ESLint checking during development
  eslint: {
    // Enable ESLint in production, disable in development
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion', 'lottie-react'],
  },
};

module.exports = nextConfig; 