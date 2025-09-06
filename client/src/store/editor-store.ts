import { create } from "zustand";

interface TestCase {
  stdin: string;
  expected_output: string;
}

interface EditorStore {
  language: string;
  code: string;
  testCases: TestCase[];
  setLanguage: (language: string, defaultCode?: string) => void;
  setCode: (code: string) => void;
  addTestCase: (testCase: TestCase) => void;
  setTestCases: (testCases: TestCase[]) => void;
  reset: (defaultCode?: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  language: "javascript",
  code: "// Write Your Code Here",
  testCases: [],
  setLanguage: (language, defaultCode) =>
    set({
      language,
      code: defaultCode || "// Write Your Code Here",
    }),
  setCode: (code) => set({ code }),
  addTestCase: (testCase: TestCase) =>
    set((state) => ({
      testCases: [...state.testCases, testCase],
    })),
  setTestCases: (testCases: TestCase[]) => set({ testCases }),
  reset: (defaultCode) =>
    set({
      language: "javascript",
      code: defaultCode || "// Write Your Code Here",
    }),
}));
