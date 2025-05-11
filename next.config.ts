import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  },
};

export default nextConfig;
