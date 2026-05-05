import { create } from 'zustand'

export type ViewMode = 'inbox' | 'discover' | 'research' | 'cadences' | 'pipeline' | 'analytics' | 'settings'

interface AppState {
  sidebarOpen: boolean
  darkMode: boolean
  commandBarOpen: boolean
  selectedLeadId: string | null
  toggleSidebar: () => void
  toggleDarkMode: () => void
  toggleCommandBar: () => void
  setSelectedLead: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  darkMode: false,
  commandBarOpen: false,
  selectedLeadId: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  toggleCommandBar: () => set((s) => ({ commandBarOpen: !s.commandBarOpen })),
  setSelectedLead: (id) => set({ selectedLeadId: id }),
}))
