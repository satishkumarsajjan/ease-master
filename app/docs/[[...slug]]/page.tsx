import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs"
import { EditOnGitHub } from "@/components/layout/edit-on-github"
import { TableOfContents } from "@/components/layout/toc"
import { defaultMdxComponents } from "@/components/mdx-components"
import { DocDemoRenderer } from "@/components/docs/doc-demo-renderer"
import { CopyMdxButton } from "@/components/ui/copy-mdx-button"
import { SITE_URL, PRODUCT } from "@/lib/config"
import { TWITTER_CREATOR } from "@/config/site"
import {
  getDocBreadcrumbSchema,
  getDocCopyPayload,
  getDocEntitySchema,
  getLastModifiedTime,
  resolveDocDemos,
} from "@/lib/docs-page"
import { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { findNeighbour } from "fumadocs-core/page-tree"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

function getBadgeStyle(badge: string) {
  switch (badge.toLowerCase()) {
    case "new":
      return "bg-primary text-primary-foreground"
    case "updated":
      return "bg-secondary text-secondary-foreground"
    case "beta":
      return "bg-primary text-primary-foreground"
    case "deprecated":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) return {}

  const slugPath = params.slug ? params.slug.join("/") : ""
  const canonicalUrl = `${SITE_URL}/docs/${slugPath}`
  const description =
    page.data.description ||
    `Explore the ${page.data.title} page of the ${PRODUCT.name} documentation.`

  const lastModifiedRaw = await getLastModifiedTime(page.path)
  const urlCategory = page.url.split("/")[3]

  const tags: string[] = []
  if (page.data.badge) tags.push(page.data.badge)
  if (urlCategory) tags.push(urlCategory)

  const dynamicLabel = urlCategory
    ? urlCategory.replace(/-/g, " ").toUpperCase()
    : "DOCUMENTATION"

  const ogUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(page.data.title)}&label=${encodeURIComponent(dynamicLabel)}`

  return {
    title: page.data.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      ...(lastModifiedRaw && {
        "article:published_time": lastModifiedRaw,
        "article:modified_time": lastModifiedRaw,
      }),
      ...(urlCategory && {
        "article:section": urlCategory,
      }),
      ...(tags.length > 0 && {
        "article:tag": tags.join(", "),
      }),
    },
    openGraph: {
      title: `${page.data.title} | ${PRODUCT.name}`,
      description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.data.title} | ${PRODUCT.name}`,
      description,
      site: "@satisium",
      creator: TWITTER_CREATOR,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
  }
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) notFound()

  const [copyPayload, resolvedDemos, lastModifiedTime] = await Promise.all([
    getDocCopyPayload(page.path),
    resolveDocDemos(page),
    getLastModifiedTime(page.path),
  ])

  const MDX = page.data.body
  const neighbours = findNeighbour(source.pageTree, page.url)
  const isCatalogPage = Boolean(page.data.wide)

  const hasToc =
    !page.data.hideToc && Boolean(page.data.toc && page.data.toc.length > 0)

  const breadcrumbSchema = getDocBreadcrumbSchema(params.slug)
  const entitySchema = getDocEntitySchema(
    page.data.title,
    page.data.description
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entitySchema) }}
      />

      <div className="flex w-full animate-in flex-col duration-700 ease-out-expo fade-in">
        <DocDemoRenderer
          title={page.data.title}
          demos={resolvedDemos}
          githubUrl={page.data.links?.github}
          previewUrl={page.data.links?.preview}
        />

        {/* The article is capped as ONE block — header, prose and TOC together —
            so the header aligns directly over the content spine it introduces.
            Catalog pages opt out: they are galleries, not prose. */}
        <article
          id="installation"
          className={cn(
            "mx-auto flex w-full flex-col py-12 lg:py-16",
            "px-6 sm:px-8",
            isCatalogPage
              ? "max-w-[1440px]"
              : !hasToc
                ? "max-w-[calc(var(--docs-measure)+var(--docs-article-padding))]"
                : "max-w-(--docs-article-max)"
          )}
        >
          <div
            className={cn(
              "grid items-start gap-10 lg:gap-12",
              !hasToc
                ? "w-full grid-cols-1"
                : "w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_var(--docs-toc-w)]"
            )}
          >
            <div className="w-full min-w-0 pb-32">
              <header className="mb-12 flex flex-col gap-6">
                <PageBreadcrumbs pageUrl={page.url} tree={source.pageTree} />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center-safe sm:justify-start">
                    <h1 className="capitalize">{page.data.title}</h1>
                    <div className="flex flex-row flex-wrap items-center gap-4">
                      {page.data.badge && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold tracking-widest uppercase",
                            getBadgeStyle(page.data.badge)
                          )}
                        >
                          {page.data.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    {page.data.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                    {lastModifiedTime && (
                      <div className="flex items-center gap-2">
                        <span className="text-caption">Last Modified:</span>
                        <span className="text-caption">{lastModifiedTime}</span>
                      </div>
                    )}
                    <EditOnGitHub path={page.path} />
                  </div>
                </div>

                {!page.data.hideCopy && (
                  <div className="mt-2 flex flex-col-reverse items-start justify-start gap-4">
                    <CopyMdxButton rawMdx={copyPayload} />
                  </div>
                )}
              </header>

              <MDX components={defaultMdxComponents} />

              <div className="mt-24 flex flex-col gap-8 pt-10">
                <nav
                  aria-label="Pagination"
                  className="flex flex-col items-center justify-between gap-8 sm:flex-row"
                >
                  {neighbours.previous ? (
                    <Link
                      href={neighbours.previous.url}
                      className="group flex w-full flex-col gap-2 sm:w-auto"
                    >
                      <span className="font-mono text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                        Previous
                      </span>
                      <span className="flex items-center gap-2 font-heading font-bold text-foreground transition-colors group-hover:text-primary">
                        {neighbours.previous.name}
                      </span>
                    </Link>
                  ) : (
                    <div className="hidden flex-1 sm:block" />
                  )}

                  {neighbours.next ? (
                    <Link
                      href={neighbours.next.url}
                      className="group flex w-full flex-col gap-2 text-left sm:w-auto sm:items-end sm:text-right"
                    >
                      <span className="font-mono text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                        Next
                      </span>
                      <span className="flex items-center gap-2 font-heading font-bold text-foreground transition-colors group-hover:text-primary">
                        {neighbours.next.name}
                      </span>
                    </Link>
                  ) : (
                    <div className="hidden flex-1 sm:block" />
                  )}
                </nav>
              </div>
            </div>

            {hasToc && (
              <aside className="sticky top-16 no-scrollbar hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
                <TableOfContents items={page.data.toc} />
              </aside>
            )}
          </div>
        </article>
      </div>
    </>
  )
}
