import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This repo owns its agent instructions. Without this, next dev writes a managed block
  // into AGENTS.md whenever it detects a coding agent, and that block does not follow the
  // typography this public repo keeps. The pre-commit guard in lefthook.yml is the second net.
  agentRules: false,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
