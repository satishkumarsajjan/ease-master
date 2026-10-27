import type { Metadata, Viewport } from "next"
import {
  Plus_Jakarta_Sans,
  Inter,
  IBM_Plex_Mono,
  Caveat,
} from "next/font/google"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local"

import "./globals.css"
import { RootProviders } from "@/components/providers/root-providers"
import { cn } from "@/lib/utils"
import { SITE_URL, PRODUCT } from "@/lib/config"
import { ORGANIZATION_SAME_AS, TWITTER_CREATOR } from "@/lib/social-links"
import PostHogPageView from "@/components/posthog-pageview"
import WebVitals from "@/components/web-vitals"
import { GoogleAnalytics } from "@/components/google-analytics"
import { CommandMenuDialog } from "@/components/layout/command-menu"
import { source } from "@/lib/source"
import { SkipLink } from "@/components/layout/skip-link"

const fontBrand = localFont({
  src: "../public/nulshock.bold.otf",
  variable: "--font-brand",
  display: "swap",
  weight: "700",
})

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const fontCode = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
})

const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: PRODUCT.titleTemplate,
    default: PRODUCT.defaultTitle,
  },
  description: PRODUCT.description,
  alternates: {
    canonical: "/",
    languages: { "en-US": "/" },
    types: {
      "application/llms+txt": "/llms.txt",
      "text/markdown": "/llms-full.txt",
    },
  },
  keywords: [
    "app starter",
    "docs starter",
    "next.js",
    "tailwind v4",
    "fumadocs",
    "shadcn",
    "satisium",
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: "website",
    siteName: PRODUCT.name,
    locale: "en_US",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(PRODUCT.defaultTitle)}`,
        width: 1200,
        height: 630,
        alt: PRODUCT.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT.defaultTitle,
    description: PRODUCT.description,
    creator: TWITTER_CREATOR,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(PRODUCT.defaultTitle)}`,
        width: 1200,
        height: 630,
        alt: PRODUCT.name,
      },
    ],
  },
  other: {
    "og:logo": `${SITE_URL}/android-chrome-512x512.png`,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontHeading.variable,
        fontBody.variable,
        fontCode.variable,
        fontCaveat.variable,
        fontBrand.variable
      )}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content={PRODUCT.name} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: PRODUCT.name,
              alternateName: [PRODUCT.shortName, "The Satisium Umbrella"],
              url: SITE_URL,
              publisher: {
                "@id": "https://satisium.com/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/docs/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://satisium.com/#organization",
              name: "The Satisium Umbrella",
              url: "https://satisium.com",
              sameAs: ORGANIZATION_SAME_AS,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/android-chrome-512x512.png`,
                width: 512,
                height: 512,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "@id": `${SITE_URL}/#app`,
              name: PRODUCT.name,
              url: SITE_URL,
              applicationCategory: PRODUCT.applicationCategory,
              operatingSystem: "WebBrowser",
              browserRequirements: "Requires JavaScript. Requires HTML5.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        {PRODUCT.sitelinks && PRODUCT.sitelinks.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: PRODUCT.sitelinks.map((item, index) => ({
                  "@type": "SiteNavigationElement",
                  position: index + 1,
                  name: item.name,
                  description: item.description,
                  url: `${SITE_URL}${item.path}`,
                })),
              }),
            }}
          />
        )}
        {PRODUCT.faqs && PRODUCT.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: PRODUCT.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: PRODUCT.name,
              description: PRODUCT.description,
              url: SITE_URL,
              inLanguage: "en-US",
            }),
          }}
        />
      </head>

      <body>
        <SkipLink />
        <RootProviders
          commandMenu={<CommandMenuDialog docsTree={source.pageTree} />}
        >
          <Suspense fallback={null}>
            <PostHogPageView />
            <WebVitals />
          </Suspense>
          <Analytics />
          <GoogleAnalytics />
          {children}
        </RootProviders>
      </body>
    </html>
  )
}
