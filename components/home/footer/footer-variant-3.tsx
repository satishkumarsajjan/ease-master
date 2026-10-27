"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AUTHOR, PROJECT } from "@/config/site"

export interface FooterVariant3Props extends React.HTMLAttributes<HTMLElement> {
  /**
   * The name of the creator/author (defaults to AUTHOR.name).
   */
  creatorName?: string
  /**
   * The link to the creator's portfolio/profile (defaults to AUTHOR.website).
   */
  creatorUrl?: string
  /**
   * The umbrella holding company or brand name (defaults to SATISIUM).
   */
  brandName?: string
  /**
   * The umbrella brand URL.
   */
  brandUrl?: string
  /**
   * The GitHub repository or source code URL (defaults to PROJECT.github).
   */
  sourceUrl?: string
  /**
   * Whether to display the source code link.
   */
  showSource?: boolean
}

/**
 * ============================================================================
 * FOOTER VARIANT 3: THE MINIMAL TOOL FOOTER
 * - Persona: Precision utilities, workstation canvases, minimalist tool UIs.
 * - Aesthetic: Ultra-clean, single-line typography with interactive discrete links.
 * - Invariant: Zero borders, zero separators, zero shadows. Sleek text-xs sizing.
 * - Zero bloat: No mega-grids, no directory decks, no giant banner space.
 * ============================================================================
 */
export function FooterVariant3({
  className,
  creatorName = AUTHOR.name,
  creatorUrl = AUTHOR.website,
  brandName = "SATISIUM",
  brandUrl = "https://satisium.com",
  sourceUrl = PROJECT.github,
  showSource = true,
  children,
  ...props
}: FooterVariant3Props) {
  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className={cn(
        "relative flex w-full flex-col items-center justify-center px-4 py-8 text-center select-none sm:py-10",
        className
      )}
      {...props}
    >
      <p className="max-w-4xl text-center font-sans text-xs leading-relaxed text-muted-foreground">
        {children ?? (
          <>
            Built by{" "}
            <a
              href={creatorUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              {creatorName}
            </a>
            {brandName ? (
              <>
                {" "}
                at{" "}
                <a
                  href={brandUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {brandName}
                </a>
              </>
            ) : null}
            .{" "}
            {showSource && sourceUrl ? (
              <>
                The source code is available on{" "}
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  GitHub
                </a>
                .
              </>
            ) : null}
          </>
        )}
      </p>
    </footer>
  )
}

/**
 * Semantic aliases for minimal tool implementations
 */
export const MinimalFooter = FooterVariant3
export const ToolFooter = FooterVariant3
