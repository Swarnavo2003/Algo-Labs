import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { LoginSchemaTypes, RegisterSchemaTypes, User } from "@/types";

interface ErrorRespone {
  message: string;
  error?: string;
  statusCode?: number;
}

interface AuthStore {
  authUser: User | null;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;

  getCurrentUser: () => Promise<void>;
  loginUser: (data: LoginSchemaTypes) => Promise<void>;
  registerUser: (data: RegisterSchemaTypes) => Promise<void>;
  logoutUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: false,

  getCurrentUser: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/current-user");
      console.log("checkauth response", res.data);
      set({ authUser: res.data?.data?.user });
      // toast.success(res.data?.message);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
      // console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  loginUser: async (data: LoginSchemaTypes) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      // console.log(res);
      set({ authUser: res.data?.data });
      toast.success(res.data?.message);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  registerUser: async (data: RegisterSchemaTypes) => {
    set({ isRegistering: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      // console.log(res);
      toast.success(res.data?.message);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isRegistering: false });
    }
  },

  logoutUser: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success(res.data?.message);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRespone>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
