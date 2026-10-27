import "@testing-library/jest-dom/vitest"
import * as matchers from "vitest-axe/matchers"
import { cleanup } from "@testing-library/react"
import { afterEach, expect, vi } from "vitest"

expect.extend(matchers)

afterEach(() => cleanup())

// jsdom has no matchMedia — required by useMediaQuery, MinimalThemeSwitcher,
// consent-utils and the theme provider.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// jsdom has no getContext on canvas
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = vi.fn()
}

// next/font is a build-time transform — stub it so components can mount.
vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: () => ({ variable: "--font-heading" }),
  Inter: () => ({ variable: "--font-body" }),
  IBM_Plex_Mono: () => ({ variable: "--font-code" }),
  Caveat: () => ({ variable: "--font-caveat" }),
}))
