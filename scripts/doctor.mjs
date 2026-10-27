#!/usr/bin/env node
/**
 * pnpm doctor — pre-flight checks for a Satisium product.
 * Real problems exit 1; warnings never fail the run.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const problems = []
const warnings = []
const passed = []

const abs = (p) => path.join(ROOT, p)
const exists = (p) => fs.existsSync(abs(p))
const read = (p) => fs.readFileSync(abs(p), "utf-8")
const age = (p) => (exists(p) ? fs.statSync(abs(p)).mtimeMs : 0)

// 1 — runtime
const major = Number(process.versions.node.split(".")[0])
if (major >= 20) passed.push(`Node ${process.versions.node}`)
else problems.push(`Node ${process.versions.node} — need >= 20`)

// 2 — env parity: .env.example <-> lib/env.ts
if (!exists(".env.example")) problems.push(".env.example is missing")
else if (!exists("lib/env.ts")) warnings.push("lib/env.ts missing — cannot check env parity")
else {
  const exampleKeys = new Set(
    read(".env.example")
      .split("\n")
      .map((line) => line.match(/^([A-Z0-9_]+)=/)?.[1])
      .filter(Boolean)
  )
  const codeKeys = new Set(
    Array.from(read("lib/env.ts").matchAll(/([A-Z][A-Z0-9_]{3,})\s*:/g), (m) => m[1])
  )
  const onlyExample = [...exampleKeys].filter((key) => !codeKeys.has(key))
  const onlyCode = [...codeKeys].filter((key) => !exampleKeys.has(key))

  if (onlyExample.length)
    warnings.push(`In .env.example but not parsed in lib/env.ts: ${onlyExample.join(", ")}`)
  if (onlyCode.length)
    warnings.push(`Parsed in lib/env.ts but missing from .env.example: ${onlyCode.join(", ")}`)
  if (!onlyExample.length && !onlyCode.length) passed.push(`env parity (${exampleKeys.size} vars)`)
}

// 3 — required assets
const requiredAssets = [
  "public/PlusJakartaSans-Bold.ttf",
  "public/og-bg-optimized.jpg",
  "app/icon.svg",
  "app/favicon.ico",
]
const missingAssets = requiredAssets.filter((asset) => !exists(asset))
if (missingAssets.length) problems.push(`Missing assets: ${missingAssets.join(", ")}`)
else passed.push("brand + OG assets present")

// 4 — registry hygiene
if (!exists("registry/index.ts")) warnings.push("registry/index.ts missing")
else {
  const index = read("registry/index.ts")
  const slugs = [...index.matchAll(/"([a-z0-9-]+)":\s*\{/g)].map((m) => m[1])
  for (const slug of slugs) {
    const block = index.slice(index.indexOf(`"${slug}":`)).slice(0, 600)
    if (!block.includes("name:")) warnings.push(`Registry entry "${slug}" has no name`)
    if (!block.includes("installCommand:")) warnings.push(`Registry entry "${slug}" has no installCommand`)
  }
  passed.push(`registry entries: ${slugs.length}`)
  if (age("registry/meta.ts") < age("registry/index.ts"))
    problems.push("registry/meta.ts is stale — run `pnpm build:registry:meta`")
}

// 5 — llms artifacts freshness
if (!exists("public/llms.txt")) warnings.push("public/llms.txt missing — run `pnpm llm`")
else if (age("public/llms.txt") < age("content/docs")) warnings.push("llms artifacts older than content/docs — run `pnpm llm`")
else passed.push("llms artifacts fresh")

// 6 — route discipline: literal hrefs inside components/
const offenders = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) walk(rel)
    else if (rel.endsWith(".tsx")) {
      const hits = [...read(rel).matchAll(/href="(\/[a-z0-9-\/\[\]]*)"/g)].map((m) => m[1])
      if (hits.length) offenders.push(`${rel}: ${[...new Set(hits)].join(", ")}`)
    }
  }
}
if (exists("components")) walk("components")
if (offenders.length)
  warnings.push(`Literal routes in components (use lib/routes.ts):\n    ${offenders.join("\n    ")}`)
else passed.push("no literal routes in components")

// 7 — accessibility floor: icon-only buttons carry a label
const unlabelled = []
const scanButtons = (dir) => {
  for (const entry of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) scanButtons(rel)
    else if (rel.endsWith(".tsx")) {
      const source = read(rel)
      const bareIcons = source.match(/<button(?![^>]*aria-label)[^>]*>\s*<(HugeiconsIcon|\.\.\.)/g)
      if (bareIcons) unlabelled.push(rel)
    }
  }
}
if (exists("components")) scanButtons("components")
if (unlabelled.length) warnings.push(`Buttons possibly missing aria-label: ${unlabelled.join(", ")}`)
else passed.push("button labels look good")

// 8 — docs layout architecture: the three rules that keep layouts swappable.
// These are problems, not warnings — they are what stops the architecture eroding.
const tsxFiles = (dir) => {
  const out = []
  if (!exists(dir)) return out
  for (const entry of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) out.push(...tsxFiles(rel))
    else if (rel.endsWith(".tsx")) out.push(rel)
  }
  return out
}

const DOCS_DISPATCH = "components/docs/dispatch.tsx"

const flagReaders = tsxFiles("components").filter((f) => read(f).includes("DOCS_LAYOUT"))
if (flagReaders.length === 1 && flagReaders[0] === DOCS_DISPATCH)
  passed.push(`docs layout: only ${DOCS_DISPATCH} reads DOCS_LAYOUT`)
else
  problems.push(
    `docs layout: DOCS_LAYOUT must be read only by ${DOCS_DISPATCH} — found in ` +
      (flagReaders.join(", ") || "nowhere")
  )

const pageImportsLayout = tsxFiles("app/docs").filter(
  (f) =>
    f.endsWith("/page.tsx") &&
    /from\s+["']@\/components\/docs\/layouts\//.test(read(f))
)
if (pageImportsLayout.length === 0) passed.push("docs layout: the docs page imports no layout")
else
  problems.push(
    `docs layout: the docs page must not import a layout — ${pageImportsLayout.join(", ")}`
  )

const layoutsHuntingSource = tsxFiles("components/docs/layouts").filter((f) =>
  /from\s+["']@\/lib\/source["']/.test(read(f))
)
if (layoutsHuntingSource.length === 0)
  passed.push("docs layout: layouts take data from props, not from source")
else
  problems.push(
    `docs layout: layouts must not import @/lib/source — ${layoutsHuntingSource.join(", ")}`
  )

// 9 — the TOC belongs to the page, not the shell.
//
// The TOC has to start below the page header and level with the first MDX
// heading. Only the page knows where its body begins, so a layout that renders a
// TOC pins it to the top of the route and the whole grid shifts up. The shell's
// share of the deal is publishing its scroll container via data-docs-scroll-root.
const layoutsRenderingToc = tsxFiles("components/docs/layouts").filter((f) =>
  /TableOfContents/.test(read(f))
)
if (layoutsRenderingToc.length === 0)
  passed.push("docs layout: the page owns TOC placement, not the shell")
else
  problems.push(
    "docs layout: a layout must not render <TableOfContents /> — " +
      layoutsRenderingToc.join(", ")
  )

const scrollRootSites = tsxFiles("components/docs").filter((f) =>
  /data-docs-scroll-root/.test(read(f))
)
if (scrollRootSites.length > 0)
  passed.push("docs layout: a scroll container is published for the scroll spy")
else
  problems.push(
    "docs layout: no layout publishes data-docs-scroll-root — the TOC's scroll spy would watch the viewport"
  )

// 10 — the no-borders, no-shadows rule (BUILD.md hard rule 9a).
// Scoped to the docs shell and its previewer, which is where depth has to come
// from the surface ramp. Widen only once the primitives are converted.
// `border-0` / `border-none` are resets, not chrome, so they are allowed.
const BORDERLESS_ALLOWED = /^border-(?:0|none)$/
const chromePattern =
  /(?<![\w-])((?:drop-shadow|shadow|border)-[\w[\]/.-]+)/g

const chromeOffenders = []
for (const dir of ["components/docs", "components/previewer"]) {
  for (const file of tsxFiles(dir)) {
    for (const [, cls] of read(file).matchAll(chromePattern)) {
      if (BORDERLESS_ALLOWED.test(cls)) continue
      chromeOffenders.push(`${file}: ${cls}`)
      break
    }
  }
}
if (chromeOffenders.length === 0) passed.push("no borders or shadows in the docs shell")
else
  problems.push(
    "no borders or shadows (rule 9a) — remove: " + chromeOffenders.join(", ")
  )

// 11 — domain discipline: strictly satisium.com (zero tolerance for .dev or other TLD assumptions)
const FORBIDDEN_DOMAINS = [/satisium\.dev/g, /satisium\.io/g, /satisium\.app/g]
const domainOffenders = []
const scanForBadDomains = (dir, extFilter = /\.(tsx?|mjs|mdx?|json)$/) => {
  if (!exists(dir)) return
  for (const entry of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== ".next" &&
        entry.name !== ".git"
      ) {
        scanForBadDomains(rel, extFilter)
      }
    } else if (extFilter.test(entry.name)) {
      const content = read(rel)
      for (const pattern of FORBIDDEN_DOMAINS) {
        if (pattern.test(content)) {
          domainOffenders.push(`${rel} matches ${pattern}`)
          break
        }
      }
    }
  }
}

for (const dir of ["config", "components", "app", "lib", "content", "scripts"]) {
  scanForBadDomains(dir)
}
if (domainOffenders.length === 0)
  passed.push("domain discipline (strictly satisium.com)")
else {
  problems.push(
    `Forbidden domain detected (Satisium is strictly 'satisium.com'):\n    ${domainOffenders.join("\n    ")}`
  )
}

// 12 — kit preservation & variant integrity
// The starter is an intact parts catalog during build. Variants and core primitives
// must NEVER be deleted during spin-up. Dead code is pruned strictly pre-deployment via pnpm knip.
const CORE_KIT_PRIMITIVES = [
  "components/docs/dispatch.tsx",
  "components/docs/layouts/spatial.tsx",
  "components/docs/layouts/three-pane.tsx",
  "components/home/hero/hero-variant-1",
  "components/home/hero/hero-variant-2",
  "components/home/footer/deck-box-1",
  "components/home/footer/deck-box-2",
  "components/home/footer/footer-variant-3.tsx",
  "components/home/features/features-variant-1.tsx",
  "components/home/features/features-variant-2.tsx",
  "components/home/features/features-variant-3.tsx",
  "components/home/features/features-variant-4.tsx",
  "components/layout/app-shell.tsx",
  "components/layout/command-menu.tsx",
  "components/layout/site-header.tsx",
  "components/ui/button.tsx",
  "components/ui/dialog.tsx",
  "components/ui/kbd.tsx",
  "components/ui/sonner.tsx",
  "components/ui/sheet.tsx",
]
const missingKitItems = CORE_KIT_PRIMITIVES.filter((p) => !exists(p))
if (missingKitItems.length === 0) {
  passed.push(`kit preservation & variant integrity (${CORE_KIT_PRIMITIVES.length} core primitives & variants intact)`)
} else {
  problems.push(
    `Kit integrity violation: missing required kit file/variant: ${missingKitItems.join(
      ", "
    )} — Starter variants must not be deleted during build. Keep all options intact.`
  )
}

// report
console.log("\n🩺  Satisium doctor\n")
for (const line of passed) console.log(`  ✅ ${line}`)
for (const line of warnings) console.log(`  ⚠️  ${line}`)
for (const line of problems) console.log(`  ❌ ${line}`)
console.log(`\n  ${passed.length} passed · ${warnings.length} warnings · ${problems.length} problems\n`)

if (problems.length) process.exit(1)
