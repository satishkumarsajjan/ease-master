import { ArrowUpRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PRODUCT } from "@/lib/config"
import { AUTHOR, AUTHOR_SOCIALS } from "@/lib/social-links"

/**
 * Example content for the docs shell's optional third rail.
 *
 * This exists so `pnpm dev` shows the pane actually working — an empty slot reads
 * as a broken layout, and a slot nobody can see is code that rots. Replace it
 * with your own, or delete the `aside` prop in `app/docs/[[...slug]]/layout.tsx`
 * and the rail disappears.
 *
 * Note the surfaces: `bg-accent` on a `bg-background` pane, no border, no shadow.
 * Depth is one step up the achromatic ramp — see `app/globals.css`.
 */
export function DocsAsideSponsorRail() {
  return (
    <div className="flex flex-col gap-3">
      <aside
        aria-label="Sponsor"
        className="flex flex-col gap-3 rounded-lg bg-accent px-3.5 py-2.5"
      >
        <span className="text-[0.625rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Sponsor
        </span>
        <p className="text-sm font-medium text-foreground">
          {PRODUCT.name} Pro UI
        </p>
        <p className="text-caption text-muted-foreground">
          The full component catalogue, plus the Figma library.
        </p>
        <a
          href={AUTHOR.x}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-caption font-medium text-foreground underline-offset-4 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Learn more
          <HugeiconsIcon icon={ArrowUpRightIcon} className="size-3.5" />
        </a>
      </aside>

      <div className="rounded-lg bg-accent px-3.5 py-2.5">
        <span className="text-[0.625rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Elsewhere
        </span>
        <ul className="mt-3 flex flex-col gap-2">
          {AUTHOR_SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
