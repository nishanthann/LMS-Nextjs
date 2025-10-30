import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nexuslms.t3.storage.dev",
        port: "",
      },
    ],
  },
};

export default nextConfig;
