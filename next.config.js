/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move tracing config to root level as per Next.js 15.x recommendations
  outputFileTracingExcludes: { 
    '*': ['node_modules/**', '.git/**', '.next/**'] 
  },
  outputFileTracingRoot: process.cwd(),
  
  // Configure experimental features
  experimental: {
    disableOptimizedLoading: false,
  },
  
  // Add webpack configuration to exclude Python files and the python directory
  webpack: (config, { isServer }) => {
    // Ignore the python directory completely
    config.resolve.alias = {
      ...config.resolve.alias,
      'src/app/api/v1/python': false,
    };
    
    // Make Next.js ignore python files
    config.module.rules.push({
      test: /\.py$/,
      use: 'null-loader',
    });
    
    return config;
  },
  
  // Add more reliable error handling for Windows environments
  onDemandEntries: {
    // Keep pages in memory longer to avoid rebuilds
    maxInactiveAge: 60 * 60 * 1000,
    // Reduce number of pages in memory for stability
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig; 