import { MetadataRoute } from "next"
import { source, legalSource } from "@/lib/source"
import { PRODUCT, SITE_URL } from "@/lib/config"
import { LEGAL } from "@/config/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseDate = new Date(LEGAL.updated || "2026-01-01")

  const docUrls = source.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: baseDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const legalUrls = legalSource.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: baseDate,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }))

  // Sitelinks from product configuration (e.g. custom tools or sub-routes)
  const sitelinkUrls = (PRODUCT.sitelinks || [])
    .filter((link) => {
      return (
        link.path !== "/" &&
        link.path !== "/app" &&
        !link.path.startsWith("/docs")
      )
    })
    .map((link) => ({
      url: `${SITE_URL}${link.path}`,
      lastModified: baseDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

  return [
    {
      url: SITE_URL,
      lastModified: baseDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/app`,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...sitelinkUrls,
    ...docUrls,
    ...legalUrls,
  ]
}
