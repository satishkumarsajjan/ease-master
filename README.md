# Satisium Starter

<div align="center">

**A brand-aligned App + Docs foundation built with Next.js 16, React 19, Tailwind CSS v4, and Fumadocs.**

[![CI](https://github.com/satisium/starter/actions/workflows/ci.yml/badge.svg)](https://github.com/satisium/starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-16.7-purple)](https://fumadocs.vercel.app/)

[Live Demo](https://starter.satisium.com) · [Documentation](https://starter.satisium.com/docs) · [Component Kit](https://starter.satisium.com/docs/components) · [Registry](https://starter.satisium.com/r/registry.json)

</div>

---

## Overview

Satisium Starter eliminates the disconnect between your application and its documentation. Build your product canvas at `/app` and publish interactive, beautiful documentation at `/docs` from a single codebase sharing the same design tokens, command menu, and navigation.

### Highlights

- **Dual Docs Architecture:** Choose between **Spatial** (signature card-shift layout) and **Three-Pane** (borderless sidebar, reading measure article, contextual third rail) shells.
- **Achromatic Surface Ramp:** Zero-shadow design. Depth is established purely through OKLCH luminance tokens (`bg-muted` vs `bg-background`).
- **Shadcn Open Registry Pipeline:** Distribute your components to external projects via `public/r/*.json` and `npx shadcn add`.
- **Zero-Key Rule:** The entire app boots, builds, and passes tests with an empty `.env.local`.
- **Automated Health Engine (`pnpm doctor`):** 13 automated rules verify architectural contracts, zero borders in docs, and accessibility compliance.
- **AI / LLM Ready:** Automated generation of `llms.txt`, `llms-full.txt`, and copyable MDX payloads.

---

## Quick Start

```bash
# Clone the template
git clone https://github.com/satisium/starter.git my-product
cd my-product

# Install dependencies
pnpm install

# Brand and configure your project (interactive preset selection)
pnpm setup

# Start the Turbopack development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your landing page, `/app` for your product workstation, and `/docs` for your documentation engine.

---

## Presets & Scaffolding

Satisium includes an automated setup script (`pnpm setup`) that brands and prunes the template into your desired product form:

| Preset    | What It Keeps                                       | What It Prunes                                       | Target Use Case                             |
| :-------- | :-------------------------------------------------- | :--------------------------------------------------- | :------------------------------------------ |
| `library` | App shell, Docs, Registry, Previewer, Landing       | _None_                                               | Component libraries (e.g., Satisium Pro UI) |
| `tool`    | App shell, Workstation canvas, Docs, Landing, Legal | `registry/**`, `public/r/**`, `components/previewer` | Dev tools & design-engineer utilities       |
| `saas`    | App shell, Marketing, Legal, Analytics, Docs        | Registry + Previewer + demo registry pages           | Production SaaS web apps                    |
| `landing` | Landing hero, Bento grid, Legal, SEO                | Docs engine + Registry + `/app`                      | Minimal waitlist or launch website          |

Non-interactive setup for CI or scripts:

```bash
pnpm setup --name "My App" --slug my-app --domain https://myapp.com --preset tool
```

---

## Using with Shadcn CLI

Components in the `registry/` directory are compiled into the Shadcn Open Registry standard. You can add them to any Next.js project:

```bash
# Add a single component via URL
npx shadcn@latest add https://starter.satisium.com/r/action-button.json
```

Or configure Satisium in your project's `components.json`:

```json
{
  "registries": {
    "satisium": "https://starter.satisium.com/r"
  }
}
```

Then install by name:

```bash
npx shadcn@latest add @satisium/action-button
npx shadcn@latest add @satisium/stat-card
```

---

## Commands & Scripts

| Task                  | Command                                            | Description                                           |
| :-------------------- | :------------------------------------------------- | :---------------------------------------------------- |
| **Dev Server**        | `pnpm dev`                                         | Next.js 16 dev server with Turbopack                  |
| **Verification Gate** | `pnpm verify`                                      | Runs lint, typecheck, test, and production build      |
| **Health Check**      | `pnpm doctor`                                      | 13-point architectural and contract auditor           |
| **Unit Tests**        | `pnpm test`                                        | Runs Vitest unit and regression tests                 |
| **E2E & A11y**        | `pnpm e2e`                                         | Playwright smoke tests + Axe accessibility audit      |
| **Compile Registry**  | `pnpm build:registry:meta && pnpm registry:public` | Builds `public/r/*.json` distribution schemas         |
| **Scaffold Doc**      | `pnpm make:doc <slug> [section]`                   | Creates frontmatter and MDX doc boilerplate           |
| **AI Documentation**  | `pnpm llm`                                         | Compiles `public/llms.txt` and `public/llms-full.txt` |
| **Release Notes**     | `pnpm changeset`                                   | Bumps versions and updates changelogs                 |

---

## Directory Blueprint

```
starter-template/
├─ app/
│  ├─ page.tsx                     # Landing page with SiteHeader, HeroShowcase, Launchpad
│  ├─ app/page.tsx                 # Product workstation canvas
│  ├─ docs/[[...slug]]/page.tsx    # Fumadocs dynamic MDX documentation
│  ├─ embed/[registryKey]/page.tsx # Isolated iframe renderer
│  └─ preview/[registryKey]/       # Fullscreen component previewer
├─ components/
│  ├─ app/                         # Workspace workstation canvas & tool components
│  ├─ docs/                        # Docs layouts (Spatial & Three-Pane), chrome, TOC
│  ├─ home/                        # Landing hero, HeroShowcase, Bento Launchpad, Footer
│  ├─ layout/                      # AppShell, SiteHeader, AppNav, CommandMenu
│  ├─ previewer/                   # Resizable playground, toolbox, canvas
│  └─ ui/                          # Satisium tokenized component primitives
├─ config/site.ts                  # Centralized brand, project, and author configuration
├─ content/docs/                   # MDX documentation source files
├─ lib/                            # Motion springs, hotkeys, routes, nav, telemetry
├─ registry/                       # Distributable Shadcn registry components
└─ scripts/                        # doctor.mjs, init-project.mjs, build-llms.mjs
```

---

## License

Released under the [MIT License](LICENSE). Built by [Satisium](https://github.com/satisium).
