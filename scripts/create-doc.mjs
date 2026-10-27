#!/usr/bin/env node
/**
 * pnpm make:doc <slug> [section]
 * Creates content/docs/<section>/<slug>.mdx and registers it in that section's meta.json.
 * Default section: getting-started.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const DOCS_DIR = path.join(ROOT, "content/docs")

const [slugArg, sectionArg = "getting-started"] = process.argv.slice(2)

if (!slugArg) {
  console.error("Usage: pnpm make:doc <slug> [section]")
  process.exit(1)
}

const slug = slugArg.toLowerCase().replace(/\s+/g, "-")
const section = sectionArg.toLowerCase().replace(/\s+/g, "-")
const dir = path.join(DOCS_DIR, section)
const file = path.join(dir, `${slug}.mdx`)

if (fs.existsSync(file)) {
  console.error(`✖ ${path.relative(ROOT, file)} already exists — nothing written.`)
  process.exit(1)
}

fs.mkdirSync(dir, { recursive: true })

const title = slug
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")

const template = `---\ntitle: ${title}\ndescription: TODO — one sentence. Used for SEO, search and the OG image.\n---\n\n## Overview\n\nWrite the page here.\n`

fs.writeFileSync(file, template, "utf-8")

// Keep the sidebar honest: add the slug to the section's meta.json
const metaPath = path.join(dir, "meta.json")
const fallbackTitle = section
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")
const meta = fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath, "utf-8"))
  : { title: fallbackTitle, pages: [] }

if (!Array.isArray(meta.pages)) meta.pages = []
if (!meta.pages.includes(slug)) meta.pages.push(slug)
fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf-8")

console.log(`✅ Created ${path.relative(ROOT, file)}`)
console.log(`✅ Updated ${path.relative(ROOT, metaPath)}`)
