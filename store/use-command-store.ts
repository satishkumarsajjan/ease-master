import { create } from "zustand"

interface CommandStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggle: () => void
}

export const useCommandStore = create<CommandStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
