import { create } from 'zustand'

type LoadState = {
  active: boolean
  progress: number
}

type AppState = {
  scrollProgress: number
  load: LoadState
  setScrollProgress: (value: number) => void
  setLoadState: (value: LoadState) => void
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  load: { active: false, progress: 0 },
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setLoadState: (load) => set({ load }),
}))
