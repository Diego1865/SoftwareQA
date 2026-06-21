import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces .next/standalone — a minimal server.js plus only the
  // node_modules actually used, so the Docker image doesn't need to ship
  // the full node_modules folder. See Dockerfile for how this is consumed.
  output: "standalone",

  // better-sqlite3's compiled .node binary is loaded at runtime via
  // require(), which Next's file tracer doesn't always pick up
  // automatically for native addons. This makes sure it's copied into
  // .next/standalone so the container has it.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/better-sqlite3/build/Release/*.node"],
  },

  // Lets the Next.js dev server accept requests from this LAN IP (e.g.
  // testing on a phone over wifi during `npm run dev`). Doesn't affect
  // the production/Docker build.
  allowedDevOrigins: ["192.168.1.152"],
};

export default nextConfig;