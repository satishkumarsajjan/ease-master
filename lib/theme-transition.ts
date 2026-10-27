import type React from "react"

export type ThemeTransitionVariant = "fade" | "cursor"

/**
 * Executes a GPU-accelerated View Transition for theme switching.
 * Keeps transitions snappy and smooth while conforming to the achromatic surface ramp.
 */
export function switchThemeWithTransition(
  setTheme: (theme: string) => void,
  newTheme: string,
  event: React.MouseEvent | KeyboardEvent | null = null,
  variant: ThemeTransitionVariant = "fade"
) {
  if (typeof document === "undefined" || !document.startViewTransition) {
    setTheme(newTheme)
    return
  }

  document.documentElement.classList.add("satisium-theme-transition")

  const transition = document.startViewTransition(() => {
    setTheme(newTheme)
  })

  transition.ready.then(() => {
    let keyframes: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }]
    let easing = "ease-in-out"
    let duration = 300

    if (variant === "cursor" && event && "clientX" in event) {
      const w = window.innerWidth
      const h = window.innerHeight
      const x = (event as React.MouseEvent).clientX
      const y = (event as React.MouseEvent).clientY
      const endRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
      keyframes = [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
      ]
      easing = "cubic-bezier(0.76, 0, 0.24, 1)"
      duration = 450
    }

    document.documentElement.animate(keyframes, {
      duration,
      easing,
      pseudoElement: "::view-transition-new(root)",
    })
  })

  transition.finished.finally(() => {
    document.documentElement.classList.remove("satisium-theme-transition")
  })
}
