"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { switchThemeWithTransition } from "@/lib/theme-transition"

import { useHotkey } from "@/hooks/use-hotkey"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {/* 
        ✨ Safely Encapsulated View Transition Styles
        Prevents breaking standard Next.js page transitions
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .satisium-theme-transition::view-transition-old(root),
        .satisium-theme-transition::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        .satisium-theme-transition::view-transition-new(root) {
          z-index: 9999;
        }
      `,
        }}
      />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  useHotkey("d", (event) => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    switchThemeWithTransition(setTheme, newTheme, event, "fade")
  })

  return null
}
