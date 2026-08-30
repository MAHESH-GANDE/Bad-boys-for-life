import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
