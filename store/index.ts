import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

interface PackageManagerStore {
  manager: PackageManager
  setManager: (manager: PackageManager) => void
}

export const usePackageManager = create<PackageManagerStore>()(
  persist(
    (set) => ({
      manager: "pnpm", // Default to pnpm (the modern standard)
      setManager: (manager) => set({ manager }),
    }),
    {
      name: "satisium-ui-pm-preference", // Stored securely in localStorage
    }
  )
)

export { useCommandStore } from "./use-command-store"
export { useSidebarStore } from "./use-sidebar-store"
