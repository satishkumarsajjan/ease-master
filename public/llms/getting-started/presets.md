# Product Presets (UI vs Tool)

> Understand the two architectural presets and how to build in each.

Satisium Starter standardizes on two production presets: **`tool`** and **`ui`**.

## The Two Presets at a Glance

| Feature                            | `tool` Preset                                                    | `ui` Preset                                                |
| :--------------------------------- | :--------------------------------------------------------------- | :--------------------------------------------------------- |
| **Primary Target**                 | Interactive tools, editors, SaaS utilities (e.g. Tweak, Typeset) | Component libraries, design systems (e.g. Satisium Pro UI) |
| **Product Workstation (`/app`)**   | Clean, blank canvas ready for your application logic             | Minimal entrypoint                                         |
| **Documentation Engine (`/docs`)** | User guides, onboarding, hotkeys reference                       | Component reference docs with interactive previewers       |
| **Shadcn Open Registry**           | Pruned (`public/r/*.json` removed)                               | Active (`public/r/*.json` compiled via Shadcn standard)    |
| **Component Previewer**            | Pruned (`components/previewer` removed)                          | Active (Live resizable previewer & embed routes)           |
| **Marketing Landing Page**         | High-conversion product landing + "Open App" CTA                 | Component library showcase + "Copy CLI" install commands   |

---

## Preset 1: `tool` (Interactive Tools & Apps)

Choose the `tool` preset when building interactive web utilities, creative tools, or SaaS workstation apps:

```bash
pnpm setup --name "Tweak" --slug tweak --domain https://tweak.app --preset tool
```

### What Happens During Setup:

1. Prunes `registry/`, `public/r/`, `app/preview/`, `app/embed/`, and `components/previewer/`.
2. Updates `components/docs/doc-demo-renderer.tsx` to a no-op adapter so documentation builds with zero TypeScript errors.
3. Automatically cleans up `lib/nav.ts` to remove the "Components" navigation link from the site header, rail, and ⌘K palette.
4. Leaves `app/app/page.tsx` as a clean, blank slate ready for your canvas and controls.

---

## Preset 2: `ui` (Component Library & Registry)

Choose the `ui` preset when building a distributable design system or component kit:

```bash
pnpm setup --name "Satisium Pro UI" --slug satisium-pro-ui --domain https://ui.satisium.com --preset ui
```

### What Happens During Setup:

1. Retains the full Shadcn Open Registry pipeline.
2. Keeps the live component previewer, embed endpoints (`/embed/[registryKey]`), and fullscreen preview routes.
3. Configures `registry.json` with your product homepage and distribution URLs.
4. Distribute components to external projects via:
   ```bash
   npx shadcn@latest add https://ui.satisium.com/r/action-button.json
   ```
