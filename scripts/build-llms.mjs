#!/usr/bin/env node
/**
 * Builds the LLM surface from content/docs:
 *   public/llms/<path>.md  — per-page markdown (also the source for "Copy MD")
 *   public/llms-full.txt   — every page concatenated
 *   public/llms.txt        — the index agents read first
 *
 * Runs before every build: `"build": "node scripts/build-llms.mjs && next build"`.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")

const DOCS_DIR = path.join(ROOT, "content/docs")
const OUT_DIR = path.join(ROOT, "public/llms")
const OUTPUT_FULL = path.join(ROOT, "public/llms-full.txt")
const OUTPUT_INDEX = path.join(ROOT, "public/llms.txt")

function getSiteConfig() {
  try {
    const siteConfigPath = path.join(ROOT, "config/site.ts")
    if (fs.existsSync(siteConfigPath)) {
      const content = fs.readFileSync(siteConfigPath, "utf-8")
      const nameMatch =
        content.match(/PRODUCT:\s*ProductConfig\s*=\s*{[\s\S]*?name:\s*"([^"]+)"/) ||
        content.match(/name:\s*"([^"]+)"/)
      const descMatch = content.match(
        /description:\s*\n?\s*"([^"]+)"/
      )
      const domainMatch =
        content.match(/:\s*"(https:\/\/[a-zA-Z0-9.-]+\.satisium\.com)"/) ||
        content.match(/https:\/\/[a-zA-Z0-9.-]+\.satisium\.com/)

      return {
        name: nameMatch ? nameMatch[1] : "Satisium Starter",
        description: descMatch ? descMatch[1] : "",
        domain: domainMatch
          ? typeof domainMatch[1] === "string"
            ? domainMatch[1]
            : domainMatch[0]
          : "https://starter.satisium.com",
      }
    }
  } catch {
    // Fall back to defaults
  }
  return {
    name: "Satisium Starter",
    description: "",
    domain: "https://starter.satisium.com",
  }
}

const siteConfig = getSiteConfig()
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain
const PRODUCT_NAME = siteConfig.name

/** Recursively collect .md/.mdx files. */
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.mdx?$/.test(entry.name)) acc.push(full)
  }
  return acc
}

/** Minimal, dependency-free frontmatter reader (flat scalar keys only). */
function parseFrontmatter(raw) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw)
  const data = {}
  let body = raw
  if (match) {
    body = raw.slice(match[0].length)
    for (const line of match[1].split("\n")) {
      const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim())
      if (!kv) continue
      data[kv[1]] = kv[2].replace(/^["']|[\"']$/g, "")
    }
  }
  return { data, body }
}

/** Drop MDX-only syntax so the markdown reads cleanly for an LLM. */
function stripMdx(body) {
  return body
    .replace(/^\s*import\s.+$/gm, "")
    .replace(/<CommandBlock[\s\S]*?\/>/g, "")
    .replace(/^\s*<(div|section)[^>]*>\s*$/gm, "")
    .replace(/^\s*<\/(div|section)>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.log("⚠️  content/docs not found — skipping LLM build.")
    return
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const pages = walk(DOCS_DIR)
    .sort()
    .map((file) => {
      const relative = path.relative(DOCS_DIR, file)
      const slug = relative.replace(/\.mdx?$/, "").replace(/(^|\/)index$/, "")
      const { data, body } = parseFrontmatter(fs.readFileSync(file, "utf-8"))

      return {
        slug,
        title: data.title || slug.split("/").pop() || "Introduction",
        description: data.description || "",
        section: slug.includes("/") ? slug.split("/")[0] : "Docs",
        url: `${SITE_URL}/docs${slug ? `/${slug}` : ""}`,
        markdown: stripMdx(body),
      }
    })

  // 1 — per-page markdown (getDocCopyPayload reads these first)
  for (const page of pages) {
    const target = path.join(OUT_DIR, page.slug ? `${page.slug}.md` : "index.md")
    fs.mkdirSync(path.dirname(target), { recursive: true })
    const header = `# ${page.title}\n\n${page.description ? `> ${page.description}\n\n` : ""}`
    fs.writeFileSync(target, `${header}${page.markdown}\n`, "utf-8")
  }

  // 2 — llms-full.txt
  const fullHeader =
    `# ${PRODUCT_NAME} — Complete AI Knowledge Base\n\n` +
    `> Source: ${SITE_URL}\n> Generated: ${new Date().toISOString()}\n> Pages: ${pages.length}\n\n`
  const fullBody = pages
    .map((page) => `---\n\n# ${page.title}\n<source>${page.url}</source>\n\n${page.markdown}\n`)
    .join("\n")
  fs.writeFileSync(OUTPUT_FULL, fullHeader + fullBody, "utf-8")

  // 3 — llms.txt (grouped by top-level folder)
  const groups = new Map()
  for (const page of pages) {
    if (!groups.has(page.section)) groups.set(page.section, [])
    groups.get(page.section).push(page)
  }

  let index = `# ${PRODUCT_NAME}\n\n> ${SITE_URL}\n${siteConfig.description ? `> ${siteConfig.description}\n` : ""}\n`
  for (const [section, items] of groups) {
    index += `## ${section}\n\n`
    for (const item of items) {
      index += `- [${item.title}](${item.url})${item.description ? ` — ${item.description}` : ""}\n`
    }
    index += "\n"
  }
  index += `## Optional\n\n- [Complete knowledge base](${SITE_URL}/llms-full.txt)\n`
  fs.writeFileSync(OUTPUT_INDEX, index, "utf-8")

  console.log(
    `✅ LLM build — ${pages.length} pages → public/llms/, llms-full.txt, llms.txt`
  )
}

main()
