import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/beacon",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
