import type { Metadata } from "next"
import { PRODUCT, SITE_URL } from "@/lib/config"
import { TWITTER_CREATOR } from "@/lib/social-links"

const description =
  "Documentation for " +
  PRODUCT.name +
  " — built with Next.js, Tailwind v4 and Fumadocs."

export const metadata: Metadata = {
  title: `Docs | ${PRODUCT.name}`,
  description,
  alternates: { canonical: `${SITE_URL}/docs` },
  openGraph: {
    title: `Docs | ${PRODUCT.name}`,
    description,
    images: [
      {
        url: "/api/og?title=Documentation",
        width: 1200,
        height: 630,
        alt: `${PRODUCT.name} Documentation`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Docs | ${PRODUCT.name}`,
    description,
    creator: TWITTER_CREATOR,
    images: [
      {
        url: "/api/og?title=Documentation",
        width: 1200,
        height: 630,
        alt: `${PRODUCT.name} Documentation`,
      },
    ],
  },
}

import { DocsShell } from "@/components/docs/dispatch"
import { DocsAsideSponsorRail } from "@/components/docs/panes/sponsor-rail"
import { source } from "@/lib/source"

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DocsShell tree={source.pageTree} aside={<DocsAsideSponsorRail />}>
      {children}
    </DocsShell>
  )
}
