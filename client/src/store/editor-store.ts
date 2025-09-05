// store/editor-store.ts
import { create } from "zustand";

interface EditorStore {
  language: string;
  code: string;
  setLanguage: (language: string, defaultCode?: string) => void;
  setCode: (code: string) => void;
  reset: (defaultCode?: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  language: "javascript",
  code: "// Write Your Code Here",
  setLanguage: (language, defaultCode) =>
    set({
      language,
      code: defaultCode || "// Write Your Code Here",
    }),
  setCode: (code) => set({ code }),
  reset: (defaultCode) =>
    set({
      language: "javascript",
      code: defaultCode || "// Write Your Code Here",
    }),
}));
