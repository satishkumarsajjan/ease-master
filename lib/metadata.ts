import type { Metadata } from "next"

import { PRODUCT, SITE_URL } from "@/lib/config"
import { TWITTER_CREATOR } from "@/config/site"

export interface BuildMetadataInput {
  title: string
  description?: string
  /** Absolute path starting with "/" — becomes the canonical URL. */
  path?: string
  /** Override the generated OG image (absolute URL or root-relative path). */
  image?: string
  /** Right-hand eyebrow on the OG card (docs pages pass the section). */
  label?: string
  noIndex?: boolean
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  label,
  noIndex,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataInput): Metadata {
  const canonical = `${SITE_URL}${path === "/" ? "" : path}`
  const desc = description ?? PRODUCT.description

  // Construct absolute URL for OG image to ensure Twitter, LinkedIn, Discord & Slack scrapers unfurl properly
  const ogImageUrl = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}${label ? `&label=${encodeURIComponent(label)}` : ""}`

  return {
    title,
    description: desc,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title,
      description: desc,
      url: canonical,
      siteName: PRODUCT.name,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      site: "@satisium",
      creator: TWITTER_CREATOR,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
  }
}
