import { axiosInstance } from "@/lib/axios";
import type { Problem } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ProblemStore {
  problems: Problem[] | [];
  problem: Problem | null;
  isProblemsLoading: boolean;
  isProblemLoading: boolean;
  getAllProblems: () => Promise<void>;
  getProblemById: (id: string) => Promise<void>;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  problem: null,
  isProblemsLoading: false,
  isProblemLoading: false,
  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstance.get("/problems/get-all-problems");
      if (res.data.success) {
        set({ problems: res.data.data });
      }
    } catch (error) {
      console.error("Error getting all problems", error);
      toast.error("Error getting all problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },
  getProblemById: async (id: string) => {
    try {
      set({ isProblemLoading: true });
      const response = await axiosInstance.get(`/problems/get-problem/${id}`);
      if (response.data.success) {
        set({ problem: response.data.data });
      }
    } catch (error) {
      console.error("Error getting problem by id", error);
      toast.error("Error getting problem by id");
    } finally {
      set({ isProblemLoading: false });
    }
  },
}));
