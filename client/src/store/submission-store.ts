import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

interface SubmissionData {
  id: string;
  userId: string;
  problemId: string;
  sourceCode: string;
  language: string;
  stdin: string;
  stdout: string;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  memory: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionStore {
  isLoading: boolean;
  submissions: SubmissionData[];
  userSubmissions: SubmissionData[];
  allSubmissions: SubmissionData[];

  getUserSubmissions: () => Promise<void>;
  getSubmissionsForProblem: (problemId: string) => Promise<void>;
  getAllSubmissionsForProblem: (problemId: string) => Promise<void>;
}

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  isLoading: false,
  submissions: [],
  userSubmissions: [],
  allSubmissions: [],

  getUserSubmissions: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/submission/get-all-submission`
      );
      if (response.data.success) {
        set({ submissions: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching user submissions", error);
      toast.error("Error fetching submissions");
    } finally {
      set({ isLoading: false });
    }
  },
  getSubmissionsForProblem: async (problemId: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );
      if (response.data.success) {
        set({ userSubmissions: response.data.data.submission });
      }
    } catch (error) {
      console.error("Error fetching problem submissions", error);
      toast.error("Error fetching problem submissions");
    } finally {
      set({ isLoading: false });
    }
  },
  getAllSubmissionsForProblem: async (problemId: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/submission/get-submission-count/${problemId}`
      );
      if (response.data.success) {
        set({ allSubmissions: response.data.data.submission });
      }
    } catch (error) {
      console.error("Error fetching problem submissions", error);
      toast.error("Error fetching problem submissions");
    } finally {
      set({ isLoading: false });
    }
  },
}));
