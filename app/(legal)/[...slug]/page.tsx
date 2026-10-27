import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { LegalFooter } from "@/components/layout/legal-footer"
import { defaultMdxComponents } from "@/components/mdx-components"
import { buildMetadata } from "@/lib/metadata"
import { legalSource } from "@/lib/source"

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  return legalSource.generateParams().filter((param) => {
    // Exclude root/empty slug if any to prevent conflict with app/page.tsx
    return Array.isArray(param.slug) && param.slug.length > 0
  })
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  if (!params.slug || params.slug.length === 0) return {}

  const page = legalSource.getPage(params.slug)
  if (!page) return {}

  return buildMetadata({
    title: page.data.title,
    description: page.data.description,
    path: `/${params.slug.join("/")}`,
    label: "LEGAL",
  })
}

export default async function LegalPage(props: PageProps) {
  const params = await props.params
  if (!params.slug || params.slug.length === 0) {
    notFound()
  }

  const page = legalSource.getPage(params.slug)
  if (!page) {
    notFound()
  }

  const MDX = page.data.body

  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
      <article className="prose max-w-none prose-neutral dark:prose-invert">
        <MDX components={defaultMdxComponents} />
      </article>
      <LegalFooter />
    </div>
  )
}
