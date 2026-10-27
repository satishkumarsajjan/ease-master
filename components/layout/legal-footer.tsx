import { LEGAL } from "@/lib/legal"

export function LegalFooter() {
  return (
    <footer className="mt-16 border-t border-border pt-8 text-caption text-muted-foreground">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Last updated: <time dateTime={LEGAL.updated}>{LEGAL.updated}</time>{" "}
          &bull; {LEGAL.company} ({LEGAL.jurisdiction})
        </p>
        <p>
          Questions? Contact{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {LEGAL.contactEmail}
          </a>
        </p>
      </div>
    </footer>
  )
}
