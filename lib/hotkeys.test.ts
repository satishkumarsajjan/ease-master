import { describe, expect, it } from "vitest"

import { HOTKEYS, formatHotkey, hotkeyById } from "@/lib/hotkeys"

describe("hotkeys", () => {
  it("has no duplicate ids or keys within a scope", () => {
    const ids = HOTKEYS.map((hotkey) => hotkey.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const scope of ["global", "docs", "app"] as const) {
      const keys = HOTKEYS.filter((hotkey) => hotkey.scope === scope).map(
        (hotkey) => hotkey.keys
      )
      expect(new Set(keys).size, `conflict in ${scope} scope`).toBe(keys.length)
    }
  })

  it("formats per platform", () => {
    expect(formatHotkey("mod+k", true)).toBe("⌘K")
    expect(formatHotkey("mod+k", false)).toBe("Ctrl K")
    expect(formatHotkey("escape", true)).toBe("Esc")
  })

  it("exposes the command palette shortcut", () => {
    expect(hotkeyById("command")?.keys).toBe("mod+k")
  })
})
