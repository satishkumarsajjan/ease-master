#!/usr/bin/env node
/**
 * Copies CHANGELOG.md → content/docs/changelog.mdx with Fumadocs frontmatter.
 * Run after `pnpm release` (changeset version).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")

const CHANGELOG = path.join(ROOT, "CHANGELOG.md")
const TARGET = path.join(ROOT, "content/docs/changelog.mdx")

if (!fs.existsSync(CHANGELOG)) {
  console.log("⚠️  No CHANGELOG.md yet — create one with `pnpm changeset` + `pnpm release`.")
  process.exit(0)
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"))
const changelog = fs.readFileSync(CHANGELOG, "utf-8")

// Strip the auto-generated "# <package-name>" H1 so it does not clash with the page title
const clean = changelog.replace(new RegExp(`^# ${pkg.name}\\s*\\n+`, "m"), "")
const today = new Date().toISOString().slice(0, 10)

const frontmatter = `---\ntitle: Changelog\ndescription: Release notes for ${pkg.name}.\nwide: true\nhideToc: true\ndate: "${today}"\n---\n\n`

fs.writeFileSync(TARGET, frontmatter + clean, "utf-8")
console.log(`✅ Synced CHANGELOG.md → ${path.relative(ROOT, TARGET)}`)
