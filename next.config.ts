import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // docx and better-auth are server-only; keep them out of the client bundle.
  serverExternalPackages: ["docx"],
};

export default nextConfig;
