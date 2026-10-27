#!/usr/bin/env node
/**
 * pnpm remove-module <moduleId> [--write]
 *
 * Mechanical module removal:
 *   pnpm remove-module billing            # prints plan: files, deps, env keys, docs, CSP origins (dry run)
 *   pnpm remove-module billing --write    # deletes files, prunes package.json + .env.example
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const abs = (relative) => path.join(ROOT, relative)

const args = process.argv.slice(2)
const isWrite = args.includes("--write")
const moduleId = args.find((a) => !a.startsWith("--"))

if (!moduleId) {
  console.error("Usage: pnpm remove-module <module-id> [--write]")
  process.exit(1)
}

// Built-in module definitions matching lib/modules.ts
const MODULES_MAP = {
  billing: {
    id: "billing",
    name: "Stripe billing",
    envKeys: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PRICE_PRO"],
    cspOrigins: {
      connect: ["https://api.stripe.com"],
      script: ["https://js.stripe.com"],
      frame: ["https://js.stripe.com", "https://checkout.stripe.com"],
    },
    dependencies: ["stripe", "@stripe/stripe-js"],
    files: ["lib/billing.ts", "app/api/stripe/webhook/route.ts", "components/billing"],
    docs: ["content/docs/kit/billing.mdx"],
    integrationPoints: [
      "lib/csp.mjs -> buildCsp({ extraConnect, extraScript, extraFrame })",
      "components/marketing/pricing-table.tsx -> checkout hrefs",
      "app/(app)/layout.tsx -> entitlement gate",
    ],
  },
  auth: {
    id: "auth",
    name: "Authentication (Better Auth)",
    envKeys: ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"],
    cspOrigins: { connect: [] },
    dependencies: ["better-auth"],
    files: ["lib/auth.ts", "app/(auth)"],
    docs: ["content/docs/kit/auth.mdx"],
    integrationPoints: [
      "proxy.ts / middleware.ts -> session check",
      "app/(app)/layout.tsx -> auth protection",
    ],
  },
  db: {
    id: "db",
    name: "Database (Drizzle + Postgres)",
    envKeys: ["DATABASE_URL"],
    cspOrigins: {},
    dependencies: ["drizzle-orm", "@neondatabase/serverless"],
    files: ["lib/db.ts", "drizzle"],
    docs: ["content/docs/kit/database.mdx"],
    integrationPoints: ["lib/db.ts -> Drizzle client"],
  },
  email: {
    id: "email",
    name: "Transactional email (Resend)",
    envKeys: ["RESEND_API_KEY"],
    cspOrigins: { connect: ["https://api.resend.com"] },
    dependencies: ["resend", "@react-email/components"],
    files: ["lib/email.ts", "emails"],
    docs: ["content/docs/kit/email.mdx"],
    integrationPoints: ["lib/email.ts -> Resend client"],
  },
}

const moduleManifest = MODULES_MAP[moduleId]
if (!moduleManifest) {
  console.error(`✖ Unknown module "${moduleId}". Available: ${Object.keys(MODULES_MAP).join(", ")}`)
  process.exit(1)
}

console.log(`\n📦 Module Plan: ${moduleManifest.name} (${moduleManifest.id})`)
console.log(`Execution Mode: ${isWrite ? "EXECUTE (--write)" : "DRY RUN (pass --write to execute)"}\n`)

console.log("Files to remove:")
for (const file of [...moduleManifest.files, ...moduleManifest.docs]) {
  const fullPath = abs(file)
  const exists = fs.existsSync(fullPath)
  console.log(`  - ${file} [${exists ? "found" : "not present"}]`)
}

console.log("\nDependencies to remove from package.json:")
for (const dep of moduleManifest.dependencies) {
  console.log(`  - ${dep}`)
}

console.log("\nEnvironment keys to remove from .env.example:")
for (const envKey of moduleManifest.envKeys) {
  console.log(`  - ${envKey}`)
}

console.log("\nIntegration points to clean up:")
for (const point of moduleManifest.integrationPoints) {
  console.log(`  - ${point}`)
}

if (!isWrite) {
  console.log("\n💡 Dry run complete. Pass '--write' to execute deletion.\n")
  process.exit(0)
}

// Execute deletion
console.log("\n🚀 Executing removal...")

// 1. Delete files
for (const file of [...moduleManifest.files, ...moduleManifest.docs]) {
  const fullPath = abs(file)
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true })
    console.log(`  ✔ Deleted ${file}`)
  }
}

// 2. Prune package.json
const pkgPath = abs("package.json")
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  let changed = false
  for (const dep of moduleManifest.dependencies) {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      delete pkg.dependencies[dep]
      changed = true
    }
    if (pkg.devDependencies && pkg.devDependencies[dep]) {
      delete pkg.devDependencies[dep]
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8")
    console.log("  ✔ Pruned dependencies from package.json")
  }
}

// 3. Prune .env.example
const envExamplePath = abs(".env.example")
if (fs.existsSync(envExamplePath)) {
  let content = fs.readFileSync(envExamplePath, "utf-8")
  for (const envKey of moduleManifest.envKeys) {
    const reg = new RegExp(`^${envKey}=.*\\n?`, "m")
    content = content.replace(reg, "")
  }
  fs.writeFileSync(envExamplePath, content, "utf-8")
  console.log("  ✔ Pruned env keys from .env.example")
}

console.log(`\n✅ Module "${moduleId}" removed successfully.\n`)
