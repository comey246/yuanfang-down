import type { NextConfig } from "next";

const configuredImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter((host) => /^[a-z0-9.-]+$/i.test(host));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.aliyuncs.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.alicdn.com",
        port: "",
        pathname: "/**"
      },
      ...configuredImageHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
        port: "",
        pathname: "/**"
      }))
    ],
    maximumRedirects: 0,
    maximumResponseBody: 10_000_000
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
