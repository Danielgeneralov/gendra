/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure experimental features
  experimental: {
    disableOptimizedLoading: false
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
  // Add other configs as needed
};

module.exports = nextConfig; 