import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppSettings {
  theme: "light" | "dark";
  showBalance: boolean;
}

interface AppState {
  settings: AppSettings;
  setTheme: (theme: AppSettings["theme"]) => void;
  setShowBalance: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        theme: "light",
        showBalance: true,
      },
      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      setShowBalance: (showBalance) =>
        set((state) => ({
          settings: { ...state.settings, showBalance },
        })),
    }),
    {
      name: "app-storage",
    }
  )
);
