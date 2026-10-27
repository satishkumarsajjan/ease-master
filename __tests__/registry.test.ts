import { describe, expect, it } from "vitest"

import { registry } from "@/registry/index"

const keys = Object.keys(registry)

describe("registry contract", () => {
  it("is not empty", () => {
    expect(keys.length).toBeGreaterThan(0)
  })

  it.each(keys)("%s is complete and serialisable", async (key) => {
    const item = registry[key]

    expect(item.name, `${key} needs a name`).toBeTruthy()
    expect(item.installCommand, `${key} needs an installCommand`).toMatch(
      /shadcn/
    )
    expect(item.previewUrl, `${key} previewUrl must match its key`).toBe(
      `/preview/${key}`
    )
    expect(["react", "video", "image"]).toContain(item.type ?? "react")

    if (item.component) {
      const files = item.getFiles ? await item.getFiles() : {}
      expect(
        Object.keys(files).length,
        `${key} getFiles() returned nothing`
      ).toBeGreaterThan(0)

      for (const [name, file] of Object.entries(files)) {
        const code = typeof file === "string" ? file : file.code
        expect(code, `${key}:${name} is empty`).toBeTruthy()
        expect(code).toContain("export")
      }
    } else {
      expect(
        item.mediaUrl,
        `${key} is not react — it needs mediaUrl`
      ).toBeTruthy()
    }
  })
})
