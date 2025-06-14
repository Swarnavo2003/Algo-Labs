import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { Problem } from "@/types";
import type { AxiosError } from "axios";

interface ErrorRespone {
  message: string;
  error?: string;
  statusCode?: number;
}

interface ProblemState {
  problems: Problem[] | [];
  problem: Problem | null;
  solvedProblems: Problem[] | [];
  isProblemsLoading: boolean;
  isProblemLoading: boolean;
  isSolvedProblemsLoading: boolean;
  getAllProblems: () => Promise<void>;
  getProblemById: (id: string) => Promise<void>;
  getSolvedProblems: () => Promise<void>;
}

export const useProblemStore = create<ProblemState>((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isSolvedProblemsLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");

      set({ problems: res.data?.data?.problems });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      console.log("Error get all problems", axiosError);
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id: string) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data?.data?.problem });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      console.log("Error get problem by id", axiosError);
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblems: async () => {
    try {
      set({ isSolvedProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-solved-problems");

      set({ solvedProblems: res.data?.data?.problems });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      console.log("Error get solved problems", axiosError);
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isSolvedProblemsLoading: false });
    }
  },
}));
