import type { ProblemValues } from "@/components/form/CreateProblemForm";
import { axiosInstance } from "@/lib/axios";
import type { Problem } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ProblemStore {
  problems: Problem[] | [];
  solvedProblems: Problem[] | [];
  problem: Problem | null;
  isProblemsLoading: boolean;
  isProblemLoading: boolean;
  isCreatingProblem: boolean;
  isSolvedProblemsLoading: boolean;
  getAllProblems: () => Promise<void>;
  getProblemById: (id: string) => Promise<void>;
  getSolvedProblems: () => Promise<void>;
  createProblem: (problem: ProblemValues) => Promise<void>;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  solvedProblems: [],
  problem: null,
  isProblemsLoading: false,
  isProblemLoading: false,
  isCreatingProblem: false,
  isSolvedProblemsLoading: false,
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
  getSolvedProblems: async () => {
    try {
      set({ isSolvedProblemsLoading: true });
      const response = await axiosInstance.get("/problems/get-solved-problems");
      if (response.data.success) {
        set({ solvedProblems: response.data.data.problems });
      }
    } catch (error) {
      console.error("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    } finally {
      set({ isSolvedProblemsLoading: false });
    }
  },
  createProblem: async (problem: ProblemValues) => {
    try {
      set({ isCreatingProblem: true });
      const response = await axiosInstance.post(
        "/problems/create-problem",
        problem
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error creating problem", error);
      toast.error("Error creating problem");
    } finally {
      set({ isCreatingProblem: false });
    }
  },
}));
