// store/use-sidebar-store.ts
import { create } from "zustand"

interface SidebarState {
  isOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
}))
