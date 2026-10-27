export type HotkeyScope = "global" | "docs" | "app"

export interface Hotkey {
  id: string
  /** "mod+k", "d", "shift+/" — "mod" = ⌘ on Apple, Ctrl elsewhere. */
  keys: string
  description: string
  scope: HotkeyScope
  /** Call preventDefault (needed for "/" and "mod+k"). */
  preventDefault?: boolean
}

export const HOTKEYS: Hotkey[] = [
  {
    id: "command",
    keys: "mod+k",
    description: "Open the command menu",
    scope: "global",
    preventDefault: true,
  },
  {
    id: "theme",
    keys: "d",
    description: "Toggle light / dark",
    scope: "global",
  },
  {
    id: "docs-sidebar",
    keys: "m",
    description: "Toggle the documentation sidebar",
    scope: "docs",
  },
  {
    id: "search",
    keys: "/",
    description: "Search",
    scope: "app",
    preventDefault: true,
  },
  {
    id: "dismiss",
    keys: "escape",
    description: "Close the top overlay",
    scope: "global",
  },
]

export const isApplePlatform = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

/** "mod+k" → "⌘K" on Apple, "Ctrl K" elsewhere. Used by <KbdShortcut /> and the docs page. */
export function formatHotkey(keys: string, apple = isApplePlatform()): string {
  const parts = keys.split("+").map((part) => {
    switch (part.toLowerCase()) {
      case "mod":
        return apple ? "⌘" : "Ctrl"
      case "shift":
        return apple ? "⇧" : "Shift"
      case "alt":
        return apple ? "⌥" : "Alt"
      case "escape":
        return "Esc"
      default:
        return part.length === 1 ? part.toUpperCase() : part
    }
  })
  return parts.join(apple ? "" : " ")
}

export const hotkeyById = (id: string) =>
  HOTKEYS.find((hotkey) => hotkey.id === id)
