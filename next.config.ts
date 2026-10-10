import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  // A stray package-lock.json in the user's home folder made Turbopack pick the wrong workspace root.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
