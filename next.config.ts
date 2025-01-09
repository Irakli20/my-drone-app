import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode
  swcMinify: true, // Enable SWC-based minification
  experimental: {
    appDir: true, // Ensure support for the `app/` directory
  },
};

export default nextConfig;
