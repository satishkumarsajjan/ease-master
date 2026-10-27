# Contributing to Satisium UI

Thank you for considering contributing to Satisium UI. This guide will give you the complete picture of how the project works, what we expect from contributions, and how to get your work merged.

---

## 1. What is Satisium UI?

Satisium UI is a high-end animated component library for React and Next.js. It distributes components through the **shadcn CLI** — users install them directly from a registry URL.

**Production URL:** [https://ui.satisium.com](https://ui.satisium.com)

**Tech stack:**

- Next.js 16 (App Router)
- Tailwind CSS v4
- Radix UI (accessible primitives)
- GSAP + Framer Motion (animations)
- Three.js / React Three Fiber (WebGL)
- Fumadocs (MDX documentation)
- Changesets (versioning & changelogs)
- pnpm (package manager)

---

## 2. Quick Start

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/ui.git
cd ui

# 2. Install dependencies
pnpm install

# 3. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the docs site.

---

## 3. Project Structure

Understanding the folder layout is essential. Every component touches multiple directories.

```
ui/
├── .changeset/              # Changeset files for versioning
├── .github/
│   ├── ISSUE_TEMPLATE/      # bug-report.yml, feature-request.yml, task-improvement.yml
│   └── PULL_REQUEST_TEMPLATE/
│       ├── bug-fix.md
│       ├── component-addition.md
│       ├── core-infrastructure.md
│       └── docs-and-llm.md
├── app/                     # Next.js App Router (site pages, layout)
├── components/              # Site-specific components (previewer, sidebar, UI primitives)
├── content/docs/            # Fumadocs MDX documentation
│   ├── components/          # Component docs
│   ├── blocks/              # Block-level patterns
│   ├── templates/           # Full page templates
│   └── getting-started/     # Intro, setup
├── hooks/                   # Shared React hooks
├── lib/                     # Utilities, source config, content queries
├── public/
│   ├── llms/                # AI context markdown (for "Copy for AI" feature)
│   └── r/                   # Built shadcn registry JSON (generated, do not edit)
├── registry/                # ← THE CORE — all distributable components live here
│   ├── ui/                  # Component source files
│   ├── demos/               # Demo implementations
│   ├── strings/             # Code-string exports for docs "Copy Code" feature
│   └── index.ts             # Runtime registry: maps keys → dynamic imports
├── scripts/                 # Build scripts (registry meta, LLM docs, changelog generator)
├── store/                   # Zustand state stores
├── CONTRIBUTING.md          # ← you are here
├── GITHUB_STRATEGY.md       # Maintainer-level strategy document
├── package.json
└── tsconfig.json
```

---

## 4. The 7-Step Component Pipeline

Adding a component is **not** a single-file change. It touches **7 locations**. You must complete all of them before opening a Pull Request.

```
Step 1: Write source     → registry/ui/<slug>.tsx
Step 2: Write demo(s)    → registry/demos/<slug>-demo.tsx
Step 3: Export strings   → registry/strings/<slug>.ts
Step 4: Register         → registry.json + registry/index.ts
Step 5: Document (Human) → content/docs/<category>/<slug>.mdx
Step 6: Document (AI)    → public/llms/<category>/<slug>.md
Step 7: Build            → pnpm registry:public && pnpm changeset && pnpm build
```

### Step 1 — Component source (`registry/ui/`)

Rules:

- Add `"use client"` at the top if the component uses hooks, event handlers, or browser APIs.
- Use `React.forwardRef` for any component that wraps a DOM element.
- **Do NOT add hardcoded padding** (`p-8`, `md:p-12`, etc.) inside the component wrapper. The previewer adds padding dynamically. Your component should fill its container.
- Include ARIA attributes (`role`, `aria-checked`, `aria-label`, etc.).
- Use only dependencies already in `package.json`: `clsx`, `tailwind-merge`, `motion`, `gsap`, `three`, etc.

```tsx
// registry/ui/my-component.tsx
"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface MyComponentProps {
  // fully typed
}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("...", className)} {...props} />
  }
)
MyComponent.displayName = "MyComponent"
```

### Step 2 — Demo(s) (`registry/demos/`)

Each demo is a **named export** that imports from `@/registry/ui/<slug>`.

```tsx
// registry/demos/my-component-demo.tsx
"use client"
import { MyComponent } from "@/registry/ui/my-component"

export function MyComponentDemo() {
  return <MyComponent />
}
```

If you need multiple demo variations, create additional files like `my-component-alt.tsx` in the same folder.

### Step 3 — Code strings (`registry/strings/`)

This file exports raw source code as template literals. It powers the **"Copy Code"** button in docs.

```ts
// registry/strings/my-component.ts
export const myComponentString = `...raw source code of registry/ui/my-component.tsx...`
export const myComponentDemoString = `...raw source code of registry/demos/my-component-demo.tsx...`

export const myComponentFile = {
  "my-component.tsx": { code: myComponentString, language: "tsx" },
  "my-component-demo.tsx": { code: myComponentDemoString, language: "tsx" },
}
```

### Step 4 — Registry entries (`registry.json` + `registry/index.ts`)

**`registry.json`** — the shadcn manifest that makes the component installable via CLI:

```json
{
  "name": "my-component",
  "type": "registry:ui",
  "title": "My Component",
  "description": "One-line description of what it does.",
  "dependencies": ["motion", "clsx", "tailwind-merge"],
  "files": [
    { "path": "registry/ui/my-component.tsx", "type": "registry:component" }
  ]
}
```

If you have demo files, add a second entry with `registryDependencies`:

```json
{
  "name": "my-component-demo",
  "type": "registry:ui",
  "title": "My Component Demo",
  "registryDependencies": ["my-component"],
  "files": [
    {
      "path": "registry/demos/my-component-demo.tsx",
      "type": "registry:component"
    }
  ]
}
```

**`registry/index.ts`** — the runtime registry that powers the docs previewer:

```ts
"my-component-demo": {
  name: "My Component Demo",
  type: "react",
  renderMode: "direct",   // use "iframe" for responsive/isolated layouts
  previewUrl: "/preview/my-component-demo",
  component: dynamic(() =>
    import("@/registry/demos/my-component-demo").then(m => m.MyComponentDemo)
  ),
  installCommand: "npx satisium-ui add my-component",
  getFiles: async () => {
    const mod = await import("@/registry/strings/my-component")
    return {
      "my-component-demo.tsx": {
        code: mod.myComponentDemoString,
        language: "tsx",
      },
    }
  },
},
```

### Step 5 — Human Documentation (`content/docs/<category>/<slug>.mdx`)

Frontmatter is validated by `source.config.ts` (Zod). Use an existing component's MDX file as a template.

**Category taxonomy** (must match `lib/utils.ts`):

| Category       | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `carousels`    | 3D and WebGL carousel components                                 |
| `text`         | Text reveals, typewriters, image transitions, and visual effects |
| `mouse-trails` | Interactive mouse-following trail components                     |

````mdx
---
title: My Component
description: A tasteful and carefully crafted component.
component: true
badge: new # new | updated | beta | deprecated
category:
  - text
author: Satisium UI
links:
  github: https://github.com/satisium/ui/blob/main/registry/ui/my-component.tsx
  preview: https://ui.satisium.com/preview/my-component-demo
registryKeys:
  - my-component-demo
media:
  image: "https://cdn.jsdelivr.net/gh/satisium/ui-assets@main/v2/previews/components/images/my-component.webp"
  video: "https://cdn.jsdelivr.net/gh/satisium/ui-assets@main/v2/previews/components/videos/my-component.mp4"
---

## Install

### CLI

<div className="mt-6">
  <CommandBlock cli="my-component" title="my-component" />
</div>

### Manual

**1. Install Dependencies**

```bash
npm install motion clsx tailwind-merge
```
````

**2. Add Source Code**

import { myComponentFile } from "@/registry/strings/my-component"

<div className="mt-6">
  <CodeBlock files={myComponentFile} height="600px" />
</div>

## Props

| Prop       | Type   | Default   | Description  |
| :--------- | :----- | :-------- | :----------- |
| `propName` | `type` | `default` | Description. |

````

### Step 6 — LLM Context Markdown (`public/llms/`)

Satisium UI has a **"Copy for AI"** button that feeds pure markdown to LLMs. You must create a `.md` file that mirrors your `.mdx` doc path.

_If your docs are at `content/docs/interactions/my-component.mdx`, create `public/llms/interactions/my-component.md`._

```markdown
# My Component

An animated component using Framer Motion.

## Installation

```bash
npx shadcn@latest add https://ui.satisium.com/r/my-component.json
````

## Source Code

```tsx
// Paste the raw component code here so the AI can read it perfectly
```

````

### Step 7 — Build, Changeset, and Verify

```bash
# 1. Generate the shadcn registry JSON
pnpm registry:public

# 2. Record your change for the release notes
pnpm changeset
#   → Select "minor" for new components, "patch" for fixes
#   → Write a conventional commit message

# 3. Verify everything passes
pnpm build
````

**Local verification checklist:**

- [ ] Component renders at `localhost:3000/docs/<category>/<slug>`
- [ ] "Copy for AI" outputs clean text from your `public/llms/` file
- [ ] No hydration errors in the browser console
- [ ] `public/r/<component-name>.json` exists and is valid
- [ ] `public/llms-full.txt` is regenerated

---

## 5. Commit Convention

We follow **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)**.

```
<type>(<scope>): <description>
```

### Types

| Type       | Use For                                                 | Changelog  |
| ---------- | ------------------------------------------------------- | ---------- |
| `feat`     | New component, demo, or feature                         | Minor bump |
| `fix`      | Bug fix in existing code                                | Patch bump |
| `docs`     | Documentation-only changes                              | Patch bump |
| `refactor` | Code change that neither fixes a bug nor adds a feature | Patch bump |
| `perf`     | Performance improvement                                 | Patch bump |
| `chore`    | Tooling, deps, CI, config                               | Patch bump |

### Scopes

| Scope        | Examples                           |
| ------------ | ---------------------------------- |
| `components` | New component PRs                  |
| `registry`   | Registry JSON, index, strings      |
| `docs`       | MDX documentation and AI md files  |
| `demos`      | Demo files                         |
| `core`       | Next.js config, layout, site infra |

### Examples

```
feat(components): add liquid marble WebGL component
fix(registry): resolve missing dependency in velocity-strips.json
docs(components): add prop table for ascent-carousel
chore(deps): upgrade motion to v12.38.0
```

### Breaking changes

Append `!` after the type/scope and add a `BREAKING CHANGE:` footer:

```
feat(components)!: change Button to use variant prop

BREAKING CHANGE: primary is renamed to default.
```

---

## 6. Branching & Pull Requests

### Branch naming

```
<type>/<short-description>
```

Examples: `feat/add-magnetic-snap-reveal`, `fix/registry-build-error`, `docs/update-changelog-data`

### Protected branches

| Branch   | Protection                                                |
| -------- | --------------------------------------------------------- |
| `main`   | Fully protected — no direct pushes, PRs only, required CI |
| `beta`   | Semi-protected — PRs only, required CI                    |
| `canary` | Semi-protected — PRs only, required CI                    |

### PR lifecycle

1. Fork → clone → create branch from `main`.
2. Complete the **7-Step Component Pipeline** (or the relevant steps for your change type).
3. Run `pnpm registry:public` to generate shadcn manifests.
4. Run `pnpm changeset` to document your change for the release notes.
5. Run `pnpm lint && pnpm typecheck && pnpm build` locally.
6. Push to your fork and open a PR against `satisium/ui main`.
7. CI runs automatically (lint → typecheck → build).
8. Maintainer reviews, requests changes, or approves.
9. Squash-merge to `main`.
10. Maintainer runs the release cycle to publish the changes.

---

## 7. Issue Management

### Issue templates

Select a template when creating a new issue.

#### Bug Report (`bug-report.yml`)

**When to use:** A component renders incorrectly, an animation breaks, or the docs site has an error.

| Field                 | What to put                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**             | Auto-filled as `fix([scope]): brief description` — change `[scope]` to the affected area, e.g., `fix(components): fluid switch thumb stuck` |
| **Bug Description**   | Current behavior vs expected behavior. Be specific.                                                                                         |
| **Reproduction Link** | CodeSandbox, StackBlitz, or GitHub repo link. **Required for fast fixes.**                                                                  |
| **Environment**       | OS, browser, Next.js version, e.g., `macOS, Chrome 126, Next.js 16.1.7`                                                                     |

**What happens after you submit:**

- GitHub auto-applies the `bug` label.
- A maintainer triages within 48 hours.
- If the reproduction link is missing, you get a `status: needs repro` label and a comment asking for one.

#### Feature Request (`feature-request.yml`)

**When to use:** Proposing a new component, animation, or site feature.

| Field                        | What to put                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Title**                    | Auto-filled as `feat([scope]): component name` — change `[scope]` and name, e.g., `feat(components): magnetic snap button` |
| **Describe the Component**   | What should it look/feel like? What animations are involved?                                                               |
| **References / Inspiration** | Dribbble shots, Twitter videos, live sites. **Required.**                                                                  |

**What happens after you submit:**

- GitHub auto-applies `type: feature` and `enhancement` labels.
- Maintainer evaluates against the roadmap.
- If accepted → `status: in-progress` when someone opens a PR.
- If declined → `wontfix` label with reasoning.

#### Task / Improvement (`task-improvement.yml`)

**When to use:** Requesting a change to **existing** code or docs — e.g., "update this UI to that", "make these tweaks", restyle a component, or adjust behavior that isn't broken and isn't a new feature.

| Field                         | What to put                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Title**                     | Auto-filled as `chore([scope]): brief description` — change `[scope]` to the affected area, e.g., `chore(components): tighten ascent-carousel spacing` |
| **Affected Component / Area** | Which component, page, or file should change.                                                                                                          |
| **Current State**             | What it looks/behaves like now. **Required.**                                                                                                          |
| **Desired State**             | What it should look/behave like after the change. **Required.**                                                                                        |
| **References / Mockups**      | Screenshots, links, or media showing the target.                                                                                                       |
| **Additional Context**        | Constraints, related issues, etc.                                                                                                                      |

**What happens after you submit:**

- GitHub auto-applies `type: improvement` and `enhancement` labels.
- Maintainer triages and may convert to a `bug-fix` or `component-addition` PR if the scope grows.

---

## 8. Pull Request Templates

Choose the template that matches your work when opening a PR. Using the wrong template will result in a review comment asking you to restart with the correct one.

| Template                 | Use When                                               |
| ------------------------ | ------------------------------------------------------ |
| `component-addition.md`  | New component + demo + docs (full 7-Step Pipeline)     |
| `bug-fix.md`             | Fixing an existing component or site bug               |
| `core-infrastructure.md` | Next.js, Tailwind, registry engine, CI, or site layout |
| `docs-and-llm.md`        | Documentation, MDX, or LLM context updates only        |

### component-addition.md

Use when you added a new component and completed all 7 steps.

**Fill in:**

- Brief description of the component and its use case.
- **Media & Previews:** Confirm thumbnail image and video preview are linked in MDX frontmatter.
- **Documentation:** Confirm MDX file exists, CLI command works, manual install steps are complete, props table is written, credits are given.
- **Demos & Implementations:** Confirm demo files exist, previews are linked, code strings export correctly, preview toolbar works.
- **JSON Registry & Engine:** Confirm you ran `pnpm registry:public` and `pnpm llm`, and that `public/r/` and `public/llms/` outputs are correct.
- **Visual Proof:** Drop a screenshot or GIF.

### bug-fix.md

Use when fixing an existing component or site bug.

**Fill in:**

- Describe what was broken and how you fixed it.
- **Issue Link:** `Fixes #12` or `Noticed during local testing`.
- **Fix Checklist:** Tested in Light/Dark mode, CLI registry paths intact, keyboard accessibility intact, MDX updated if API changed, ran `pnpm registry:public`.
- **Before / After:** Screenshots for UI fixes.

### core-infrastructure.md

Use when changing Next.js config, Tailwind, registry build scripts, CI/CD, site layout, or tooling.

**Fill in:**

- Explain the architecture change.
- **Safety Checklist:** Updated `package.json` if deps changed, local build succeeds, iframe previewer works, Vercel preview built without OOM, registry JSON format still correct.

### docs-and-llm.md

Use when updating MDX docs, fixing typos, adding prop tables, updating LLM context files, or changing the docs site.

**Fill in:**

- Describe what was updated.
- **Content Checklist:** Spelling/grammar checked, MDX frontmatter correct, internal links work, code blocks use correct syntax highlighting, ran `pnpm llm` if APIs changed.
- **Preview URL Check:** Reviewed Vercel preview deployment.

---

## 9. Accessibility (A11y) Requirements

Every component must pass these checks before merge:

| Check                   | Requirement                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| **Semantic HTML**       | Use native elements (`<button>`, `<nav>`, `<dialog>`) over `<div>` |
| **ARIA roles**          | `role="switch"`, `role="tab"`, `aria-checked`, `aria-label`, etc.  |
| **Keyboard navigation** | All interactive elements must work with Tab, Enter, Escape         |
| **Focus management**    | `focus-visible` rings are visible; modals/dialogs trap focus       |
| **Screen reader**       | Meaningful text content or `aria-label` for icon-only buttons      |
| **Reduced motion**      | Respect `prefers-reduced-motion` via CSS media query or JS check   |
| **Color contrast**      | Text meets WCAG AA (4.5:1 for normal text)                         |
| **Touch targets**       | Minimum 44×44px for interactive elements                           |
| **Forward refs**        | DOM components expose `ref` for testing and composition            |

---

## 10. General PR Rules

| Rule                   | Detail                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **One scope per PR**   | Don't combine a component addition with a docs typo fix.                                         |
| **Branch from `main`** | Always create your branch from the latest `main`.                                                |
| **Squash merge**       | Maintainers squash-merge. One logical commit per PR is ideal.                                    |
| **Link issues**        | Use `Fixes #123` or `Closes #123` in the PR description to auto-close the linked issue on merge. |
| **CI must pass**       | Lint → typecheck → build. If CI fails, the PR cannot be merged.                                  |
| **Changeset required** | Run `pnpm changeset` before pushing. Commit the generated `.changeset/*.md` file.                |

---

## 11. Quick Decision Tree

```
Is this a new component + demo + docs?
  → YES → Use component-addition.md
  → NO ↓

Is this a bug fix in existing code?
  → YES → Use bug-fix.md
  → NO ↓

Is this a change to existing code/docs (restyle, tweak, "update X to Y") — not new, not broken?
  → YES → Open a Task / Improvement issue
  → NO ↓

Is this about Next.js, Tailwind, CI, registry engine, or site infra?
  → YES → Use core-infrastructure.md
  → NO ↓

Is this only docs, MDX, or LLM context?
  → YES → Use docs-and-llm.md
  → NO → Ask in GitHub Discussions before opening an issue
```

---

## 12. What Happens After You Submit

1. **CI runs automatically** — lint, typecheck, and build. If any job fails, the PR cannot be merged.
2. **Maintainer review** — Review times depend on PR size:
   - Docs-only: 2 business days
   - Bug fix: 3 business days
   - New component: 5 business days
   - Core/infra: 5 business days
3. **Changeset consumption** — When the maintainer is ready to release, they run `pnpm changeset version`, which bumps the version, updates `CHANGELOG.md`, and commits. Your changeset file is consumed at this point.
4. **Merge** — Maintainer squash-merges to `main`. The PR is then live on the production site.

---

## 13. Need Help?

- **Questions about using components:** [Satisium HQ Discord](https://discord.gg/xQ5cPHmT7)
- **Bug reports and feature requests:** [GitHub Issues](https://github.com/satisium/ui/issues)
- **Security vulnerabilities:** **Direct Message the Founder on Discord** or email **satisiumhq@gmail.com** (do not open a public issue).
