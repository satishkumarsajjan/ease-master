import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const ROUTES = [
  "/",
  "/app",
  "/docs",
  "/docs/getting-started/installation",
  "/docs/components/pulse-card",
]

for (const route of ROUTES) {
  test(`${route} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") {
        const text = message.text()
        const url = message.location().url
        // Ignore Vercel insights / analytics in non-production or CI runner
        if (
          text.includes("/_vercel/insights") ||
          text.includes("vercel-scripts.com") ||
          url.includes("/_vercel/insights") ||
          url.includes("vercel-scripts.com") ||
          (text.includes("Failed to load resource") && text.includes("404"))
        ) {
          return
        }
        errors.push(text)
      }
    })

    await page.goto(route)
    if (route === "/app") {
      await expect(page.locator("main").first()).toBeVisible()
    } else {
      await expect(page.locator("h1").first()).toBeVisible()
    }
    expect(errors).toEqual([])
  })
}

test("theme toggle persists across navigation", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is desktop-first")
  await page.goto("/docs")
  await expect(page.locator("article")).toBeVisible()
  await page.waitForTimeout(500)

  const initialDark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  )
  await page.keyboard.press("d")
  await expect(async () => {
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    )
    expect(isDark).toBe(!initialDark)
  }).toPass({ timeout: 3000 })

  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  )
  await page.goto("/docs/changelog")
  await expect(page.locator("article")).toBeVisible()
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    )
  ).toBe(isDark)
})

test("command palette opens and finds a docs page", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "palette is desktop-first")
  await page.goto("/docs")
  await expect(page.locator("article")).toBeVisible()
  await page.waitForTimeout(500)
  await page.keyboard.press(
    process.platform === "darwin" ? "Meta+k" : "Control+k"
  )
  await expect(page.getByRole("dialog")).toBeVisible()
})

test("preview route is isolated and indexable-blocked", async ({ page }) => {
  const response = await page.goto("/preview/pulse-card")
  expect(response?.headers()["x-robots-tag"]).toContain("noindex")
})

test("docs have no critical accessibility violations", async ({ page }) => {
  await page.goto("/docs/getting-started/installation")
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze()
  expect(results.violations).toEqual([])
})

/**
 * The docs shell resolves the page in app/docs/[[...slug]]/layout.tsx. If that
 * layout were ever cached across slugs, the TOC would keep showing the previous
 * page's headings — and every route-level build would still pass, because each
 * route renders correctly in isolation.
 *
 * The two pages differ deliberately: installation has a TOC, changelog sets
 * `hideToc`.
 */
test("TOC follows the page on client-side navigation", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "TOC rail is desktop-only")
  await page.goto("/docs/getting-started/installation")

  await expect(page.getByText("On this page")).toBeVisible()

  await page.getByRole("link", { name: "Changelog" }).first().click()
  await expect(page).toHaveURL(/\/docs\/changelog/)
  // changelog sets `hideToc`, so the rail must be gone — not stale.
  await expect(page.getByText("On this page")).toHaveCount(0)

  // …and back again, so the state is not simply stuck off.
  await page.goBack()
  await expect(page.getByText("On this page")).toBeVisible()
})

/**
 * The third rail belongs to the three-pane shell only — `spatial` has two
 * surfaces and ignores `aside` whatever you pass it. Both shells honour
 * `hideAside`, because it lives in the shared contract.
 */
test("the optional rail follows the page", async ({ page }) => {
  test.skip(
    !process.env.NEXT_PUBLIC_DOCS_LAYOUT?.includes("three-pane"),
    "the third rail only exists on the three-pane shell"
  )

  await page.goto("/docs/getting-started/installation")
  const sponsors = page.getByRole("complementary", { name: "Sponsors" })
  await expect(sponsors).toBeVisible()

  await page.getByRole("link", { name: "Changelog" }).first().click()
  await expect(sponsors).toHaveCount(0)

  await page.goBack()
  await expect(sponsors).toBeVisible()
})

test("M toggles the docs sidebar", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop sidebar only")
  test.skip(
    !process.env.NEXT_PUBLIC_DOCS_LAYOUT?.includes("three-pane"),
    "spatial slides the card instead of unmounting the pane"
  )

  await page.goto("/docs/getting-started/installation")

  const sidebar = page.getByRole("navigation", {
    name: "Documentation navigation",
  })
  await expect(sidebar).toBeVisible()

  await page.keyboard.press("m")
  await expect(sidebar).toHaveCount(0)

  await page.keyboard.press("m")
  await expect(sidebar).toBeVisible()
})

/**
 * The reading measure is the anchor every pane width is derived from, so it is
 * asserted rather than eyeballed.
 *
 * The failure this catches: fixed-width rails make the article `viewport -
 * constant`, so the prose column stretches as the window grows and collapses as
 * it shrinks. Neither shows up in a route-level build — each page renders fine —
 * and both are invisible until someone reports "the panes feel cramped".
 *
 * The band is 45-75 characters at 16px body text, which is ~640-780px. Outside it
 * the eye either loses its place on the return sweep or scans too far.
 */
const PROSE_MIN = 640
const PROSE_MAX = 780

for (const width of [1024, 1280, 1440, 1920]) {
  test(`article measure stays readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/docs/getting-started/installation")

    const prose = await page.locator("article p").first().boundingBox()
    expect(prose, "no article paragraph rendered").not.toBeNull()

    // A little slack: the column may be narrower than the prose box on the
    // narrowest breakpoint, but it must never be cramped or sprawling.
    expect(prose!.width).toBeGreaterThanOrEqual(PROSE_MIN - 40)
    expect(prose!.width).toBeLessThanOrEqual(PROSE_MAX + 40)
  })
}

/** The rails must appear in cost order: TOC, then sidebar at 1280, then aside. */
test("docs chrome appears in cost order", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.goto("/docs/getting-started/installation")
  // 1024: no sidebar rail yet — it would drop the prose below the floor.
  await expect(
    page.getByRole("navigation", { name: "Documentation navigation" })
  ).toHaveCount(0)
  await expect(page.getByText("On this page")).toBeVisible()

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(
    page.getByRole("navigation", { name: "Documentation navigation" })
  ).toBeVisible()
})
