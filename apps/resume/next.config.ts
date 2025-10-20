import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["require-in-the-middle"],
  },
};

export default config;
