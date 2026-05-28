import type { NextConfig } from "next"

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval required by Next.js dev mode
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://*.supabase.co",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

const nextConfig: NextConfig = {
  transpilePackages: ["@ai-delivery/schemas", "@ai-delivery/ai", "@ai-delivery/core"],
  serverExternalPackages: ["openai"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
