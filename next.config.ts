import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.houdiniswap.com",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
