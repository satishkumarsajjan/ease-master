import { Link04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { REPO } from "@/lib/social-links"
import { cn } from "@/lib/utils"

/** `path` is the MDX path inside content/docs, e.g. "getting-started/installation.mdx". */
export function EditOnGitHub({
  path,
  className,
}: {
  path: string
  className?: string
}) {
  const href = `https://github.com/${REPO}/blob/main/content/docs/${path}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none",
        className
      )}
    >
      <HugeiconsIcon icon={Link04Icon} className="size-3.5" />
      Edit this page on GitHub
    </a>
  )
}
