// next.config.mjs
import { createMDX } from "fumadocs-mdx/next"
import withBundleAnalyzer from "@next/bundle-analyzer"
import { buildCsp } from "./lib/csp.mjs"

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/changelog",
        destination: "/docs/changelog",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ]
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      {
        key: "Content-Security-Policy",
        value: buildCsp(),
      },
    ]

    return [
      ...securityHeaders.map((header) => ({
        source: "/:path*",
        headers: [header],
      })),
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          ...securityHeaders,
        ],
      },
      {
        source: "/test/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          ...securityHeaders,
        ],
      },
      {
        source: "/embed/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          ...securityHeaders,
        ],
      },
      {
        source: "/preview/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          ...securityHeaders,
        ],
      },
    ]
  },
}

const withMDX = createMDX({})
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(withMDX(config))
