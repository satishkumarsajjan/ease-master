import type { IconType } from "@icons-pack/react-simple-icons"
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiVercel,
  SiLinear,
  SiGithub,
  SiCloudflare,
  SiStripe,
  SiBun,
  SiVite,
  SiTurborepo,
  SiRaycast,
  SiPostgresql,
  SiRedis,
} from "@icons-pack/react-simple-icons"

export interface LogoItem {
  id: string
  name: string
  icon: IconType
  category?: "framework" | "cloud" | "tool" | "database"
  href?: string
}

// -------------------------------------------------------------
// Curated Logo Collections (100% Official Vector Marks)
// -------------------------------------------------------------

export const DEFAULT_LOGOS: LogoItem[] = [
  {
    id: "nextjs",
    name: "Next.js",
    icon: SiNextdotjs,
    category: "framework",
    href: "https://nextjs.org",
  },
  {
    id: "react",
    name: "React",
    icon: SiReact,
    category: "framework",
    href: "https://react.dev",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: SiTypescript,
    category: "tool",
    href: "https://www.typescriptlang.org",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "framework",
    href: "https://tailwindcss.com",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: SiSupabase,
    category: "database",
    href: "https://supabase.com",
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: SiVercel,
    category: "cloud",
    href: "https://vercel.com",
  },
  {
    id: "linear",
    name: "Linear",
    icon: SiLinear,
    category: "tool",
    href: "https://linear.app",
  },
  {
    id: "github",
    name: "GitHub",
    icon: SiGithub,
    category: "tool",
    href: "https://github.com",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    icon: SiCloudflare,
    category: "cloud",
    href: "https://www.cloudflare.com",
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: SiStripe,
    category: "tool",
    href: "https://stripe.com",
  },
  {
    id: "bun",
    name: "Bun",
    icon: SiBun,
    category: "framework",
    href: "https://bun.sh",
  },
  {
    id: "vite",
    name: "Vite",
    icon: SiVite,
    category: "tool",
    href: "https://vite.dev",
  },
  {
    id: "turborepo",
    name: "Turborepo",
    icon: SiTurborepo,
    category: "tool",
    href: "https://turbo.build",
  },
  {
    id: "raycast",
    name: "Raycast",
    icon: SiRaycast,
    category: "tool",
    href: "https://www.raycast.com",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: SiPostgresql,
    category: "database",
    href: "https://www.postgresql.org",
  },
  {
    id: "redis",
    name: "Redis",
    icon: SiRedis,
    category: "database",
    href: "https://redis.io",
  },
]

export const TECH_STACK_LOGOS: LogoItem[] = [
  {
    id: "nextjs",
    name: "Next.js",
    icon: SiNextdotjs,
    category: "framework",
    href: "https://nextjs.org",
  },
  {
    id: "react",
    name: "React",
    icon: SiReact,
    category: "framework",
    href: "https://react.dev",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: SiTypescript,
    category: "tool",
    href: "https://www.typescriptlang.org",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "framework",
    href: "https://tailwindcss.com",
  },
  {
    id: "vite",
    name: "Vite",
    icon: SiVite,
    category: "tool",
    href: "https://vite.dev",
  },
  {
    id: "bun",
    name: "Bun",
    icon: SiBun,
    category: "framework",
    href: "https://bun.sh",
  },
  {
    id: "turborepo",
    name: "Turborepo",
    icon: SiTurborepo,
    category: "tool",
    href: "https://turbo.build",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: SiPostgresql,
    category: "database",
    href: "https://www.postgresql.org",
  },
]

export const PARTNER_LOGOS: LogoItem[] = [
  {
    id: "vercel",
    name: "Vercel",
    icon: SiVercel,
    category: "cloud",
    href: "https://vercel.com",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: SiSupabase,
    category: "database",
    href: "https://supabase.com",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    icon: SiCloudflare,
    category: "cloud",
    href: "https://www.cloudflare.com",
  },
  {
    id: "github",
    name: "GitHub",
    icon: SiGithub,
    category: "tool",
    href: "https://github.com",
  },
  {
    id: "linear",
    name: "Linear",
    icon: SiLinear,
    category: "tool",
    href: "https://linear.app",
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: SiStripe,
    category: "tool",
    href: "https://stripe.com",
  },
  {
    id: "raycast",
    name: "Raycast",
    icon: SiRaycast,
    category: "tool",
    href: "https://www.raycast.com",
  },
  {
    id: "redis",
    name: "Redis",
    icon: SiRedis,
    category: "database",
    href: "https://redis.io",
  },
]

export const CURATED_GRID_LOGOS: LogoItem[] = DEFAULT_LOGOS.slice(0, 12)
