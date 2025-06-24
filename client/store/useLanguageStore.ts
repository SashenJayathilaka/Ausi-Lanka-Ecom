// src/store/useLanguageStore.ts
import { create } from "zustand";

type Language = "en" | "si";

export const useLanguageStore = create<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
}));
