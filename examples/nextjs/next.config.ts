import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Transpile the local Voltax package
  transpilePackages: ["@noelzappy/voltax"],

  // Use webpack instead of Turbopack for local package compatibility
  webpack: (config) => {
    config.resolve.alias["@noelzappy/voltax"] = path.resolve(
      __dirname,
      "../../packages/node/dist"
    );
    return config;
  },
};

export default nextConfig;
