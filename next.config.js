/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable tracing to fix the EPERM error
  experimental: {
    disableOptimizedLoading: false,
    tracing: {
      enabled: false
    }
  },
  // Add other configs as needed
};

module.exports = nextConfig; 