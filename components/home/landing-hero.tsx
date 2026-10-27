import { CommandBlock } from "@/components/command-block"
import { HeroShowcase } from "@/components/home/hero-showcase"
import { ActionButton } from "@/components/ui/action-button"
import { PRODUCT } from "@/lib/config"
import { ROUTES } from "@/lib/routes"
import { ArrowRight01Icon, Book02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function LandingHero() {
  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 pt-16 pb-20 text-center sm:gap-10 sm:pt-20 sm:pb-24">
      {/* Eyebrow */}
      <span className="flex items-center gap-2 rounded-full bg-muted px-3.5 py-1 text-caption font-medium text-muted-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        {PRODUCT.name} · App + Docs Foundation
      </span>

      {/* Headline */}
      <h1 className="max-w-3xl text-display-lg font-bold tracking-tight text-balance text-foreground">
        Build the product, ship the docs —{" "}
        <span className="text-primary">from one template.</span>
      </h1>

      <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
        {PRODUCT.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ActionButton
          label="Open the app"
          icon={<HugeiconsIcon icon={ArrowRight01Icon} />}
          href={ROUTES.app}
        />
        <ActionButton
          label="Read the docs"
          icon={<HugeiconsIcon icon={Book02Icon} />}
          variant="outline"
          href={ROUTES.docs}
        />
      </div>

      {/* Live Interactive Satisium Showcase */}
      <div className="w-full pt-4">
        <HeroShowcase />
      </div>

      {/* The one command a newcomer needs */}
      <div className="w-full max-w-xl pt-2">
        <CommandBlock
          title="Create from this template"
          command="git clone https://github.com/satisium/starter.git my-product && cd my-product && pnpm install && pnpm dev"
        />
      </div>
    </section>
  )
}
