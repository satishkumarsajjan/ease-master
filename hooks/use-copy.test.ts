import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCopy } from "@/hooks/use-copy"

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe("useCopy", () => {
  it("copies text and flips the flag", async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      await result.current.copy("hello")
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello")
    expect(result.current.copied).toBe(true)
  })

  it("ignores empty input", async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      expect(await result.current.copy("")).toBe(false)
    })
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
  })
})
