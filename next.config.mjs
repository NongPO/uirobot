/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix lockfile warning
  outputFileTracingRoot: process.cwd(),
  
  // Optimize for production
  poweredByHeader: false,
  
  // Enable experimental features
  experimental: {
    optimizePackageImports: ['react-icons']
  },
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: false
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
