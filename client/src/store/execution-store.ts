import { axiosInstance } from "@/lib/axios";
import type { RunSummary, Submission, SubmissionResponse } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ExecutionStore {
  isRunning: boolean;
  isSubmitting: boolean;
  runResult: RunSummary | null;
  submissionResult: SubmissionResponse | null;
  runCode: (code: Submission) => Promise<void>;
  submitCode: (code: Submission) => Promise<void>;
  clearSubmission: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  isRunning: false,
  isSubmitting: false,
  runResult: null,
  submissionResult: null,
  runCode: async (code: Submission) => {
    try {
      set({ isRunning: true });
      const response = await axiosInstance.post("/execute-code/run", code);
      if (response.data.success) {
        toast.success(response.data.message);
        set({ runResult: response.data?.data?.runResult });
      }
    } catch (error) {
      console.error("Error running code", error);
      toast.error("Error running code");
    } finally {
      set({ isRunning: false });
    }
  },
  submitCode: async (code: Submission) => {
    try {
      set({ isSubmitting: true });
      const response = await axiosInstance.post("/execute-code", code);
      if (response.data.success) {
        toast.success(response.data.message);
        set({ submissionResult: response.data?.data?.submission });
      }
    } catch (error) {
      console.error("Error submitting code", error);
      toast.error("Error submitting code");
    } finally {
      set({ isSubmitting: false });
    }
  },
  clearSubmission: () => set({ submissionResult: null, runResult: null }),
}));
