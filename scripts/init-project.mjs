#!/usr/bin/env node
/**
 * pnpm setup — brand and configure this template into a new Satisium product.
 *
 *   pnpm setup
 *   pnpm setup --name "Tweak" --slug tweak --domain https://tweak.app --preset tool
 *
 * Presets:
 *   - tool: Interactive workstation canvas + product docs (Tweak, Typeset)
 *   - ui:   Component library + Shadcn registry + live previewer (Satisium Pro UI)
 */
import fs from "fs"
import path from "path"
import readline from "readline/promises"
import { fileURLToPath } from "url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

const PRESETS = {
  tool: {
    label: "Interactive Tool / App (Tweak, Typeset)",
    keepRegistry: false,
  },
  ui: {
    label: "Component Library & Open Registry (Satisium Pro UI)",
    keepRegistry: true,
  },
}

function parseFlags(argv) {
  const flags = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith("--")) continue
    const key = token.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith("--")) flags[key] = true
    else {
      flags[key] = next
      index += 1
    }
  }
  return flags
}

const abs = (relative) => path.join(ROOT, relative)
const read = (relative) => fs.readFileSync(abs(relative), "utf-8")
const write = (relative, content) => fs.writeFileSync(abs(relative), content, "utf-8")

function mustReplace(file, pattern, replacement, label) {
  const source = read(file)
  const next = source.replace(pattern, replacement)
  if (next === source) throw new Error(`init-project: could not find ${label} in ${file}`)
  write(file, next)
}

async function main() {
  if (fs.existsSync(abs(".starter-initialised"))) {
    console.error("✖ Already initialised (.starter-initialised exists).")
    process.exit(1)
  }

  const flags = parseFlags(process.argv.slice(2))
  let { name, slug, domain, preset } = flags

  if (!name || !slug || !domain || !preset) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    console.log("\n✦ Satisium Product Scaffolder ✦\n")
    name ??= await rl.question("Product name (e.g. Tweak): ")
    slug ??= name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    domain ??= await rl.question("Production origin (https://…): ")
    if (!preset) {
      console.log("\nSelect Preset:")
      console.log("  1. tool — Interactive Workstation Canvas + Product Docs")
      console.log("  2. ui   — Component Library + Shadcn Registry + Live Previewer")
      const answer = (await rl.question("\nPreset [tool|ui] (tool): ")).trim().toLowerCase()
      preset = answer === "ui" || answer === "2" ? "ui" : "tool"
    }
    rl.close()
  }

  if (!PRESETS[preset]) throw new Error(`Unknown preset "${preset}". Choose 'tool' or 'ui'.`)

  // 1 — Rebranding config/site.ts
  mustReplace("config/site.ts", /name: "Satisium Starter"/, `name: "${name}"`, "PRODUCT.name")
  mustReplace("config/site.ts", /shortName: "Starter"/, `shortName: "${name.split(" ")[0]}"`, "PRODUCT.shortName")
  mustReplace("config/site.ts", /defaultTitle: "[^"]*"/, `defaultTitle: "${name}"`, "PRODUCT.defaultTitle")
  mustReplace("config/site.ts", /titleTemplate: "[^"]*"/, `titleTemplate: "%s | ${name}"`, "PRODUCT.titleTemplate")
  mustReplace("config/site.ts", /name: "Satisium Starter"/, `name: "${name}"`, "PROJECT.name")
  mustReplace("config/site.ts", /export const REPO = "[^"]*"/, `export const REPO = "satisium/${slug}"`, "REPO")
  mustReplace("config/site.ts", /"https:\/\/your-domain\.com"/, `"${domain}"`, "SITE_URL fallback")

  mustReplace("lib/logger.ts", /\[Satisium Starter\]/g, `[${name}]`, "logger tag")

  const pkg = JSON.parse(read("package.json"))
  pkg.name = slug
  write("package.json", `${JSON.stringify(pkg, null, 2)}\n`)

  write(
    ".env.example",
    read(".env.example").replace(/NEXT_PUBLIC_SITE_URL="[^"]*"/, `NEXT_PUBLIC_SITE_URL="${domain}"`)
  )

  // 2 — Brand Configuration Complete (Zero Deletions - All engines preserved)
  // 3 — Stamp & Hand-off
  write(".starter-initialised", `${new Date().toISOString()} · ${name}\n`)

  console.log(`\n✅ ${name} initialized successfully\n`)
  console.log("  All engines (registry, previewer, docs, workstation) preserved intact.\n")
  console.log("  4-step post-init checklist:")
  console.log("   1. Brand icons: app/icon.svg, app/apple-icon.png, app/favicon.ico")
  console.log("   2. OG banner: public/og-bg-optimized.jpg, public/satisium.png")
  console.log("   3. Social profiles: config/site.ts (PROJECT & AUTHOR)")
  console.log("   4. Launch dev server: pnpm dev\n")
}

main().catch((error) => {
  console.error("✖ Scaffolder error:", error.message)
  process.exit(1)
})
