import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "karavali-products.s3.us-east-1.amazonaws.com",
        pathname: "**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;
