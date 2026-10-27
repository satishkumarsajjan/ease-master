import type * as React from "react"
import type * as PageTree from "fumadocs-core/page-tree"

/**
 * The page facts a docs layout is allowed to know.
 *
 * This is deliberately tiny. `title`, `description`, `toc`, `wide` and the badge
 * are page content — the page reads them from `page.data` directly, because only
 * the page knows where its body begins and the TOC has to start there. What stays
 * here is the one fact a shell genuinely needs in order to place a region.
 *
 * If a layout needs something that is not in here, it should not reach for it —
 * that is the rule which keeps layouts swappable. Add it here on purpose.
 */
export interface DocsPageMeta {
  /** True when the page sets `hideAside` — this page opts out of the third rail. */
  hideAside: boolean
}

/** Tailwind breakpoints the third rail can hide below. */
export type DocsAsideBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl"

/**
 * Everything here belongs to the developer, not to the docs engine. All of it is
 * optional, and none of it is required for the docs to render.
 */
export interface DocsShellConfig {
  /**
   * Content for the optional third rail: sponsors, ads, a newsletter, a
   * changelog digest. A server component, so fetch your data directly here.
   *
   * Omit it and the rail does not render. Nullish *is* the switch — there is
   * deliberately no `showAside` boolean to keep in sync with it.
   *
   * Note that a layout without a third rail ignores this: `spatial` has two
   * surfaces and never renders one, whatever you pass here.
   */
  aside?: React.ReactNode
  /**
   * Breakpoint below which the rail is not rendered.
   *
   * Defaults to `"2xl"` (1536px): the article column drops under ~670px below
   * that, and the docs stop being comfortable to read.
   */
  asideHideBelow?: DocsAsideBreakpoint
}

/** What every docs layout receives. Nothing else is in scope. */
export interface DocsShellProps extends DocsShellConfig {
  tree: PageTree.Root
  page?: DocsPageMeta
  /** Article body only — chrome, TOC and arrangement belong to the layout. */
  children: React.ReactNode
}
