import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { EmptyState } from "@/components/ui/empty-state"

describe("EmptyState", () => {
  it("renders a heading and description", () => {
    render(
      <EmptyState
        title="No projects"
        description="Create one to get started."
      />
    )
    expect(
      screen.getByRole("heading", { name: "No projects" })
    ).toBeInTheDocument()
    expect(screen.getByText("Create one to get started.")).toBeInTheDocument()
  })

  it("has no a11y violations", async () => {
    const { container } = render(<EmptyState title="No projects" />)
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })
})
