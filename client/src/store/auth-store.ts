import { axiosInstance } from "@/lib/axios";
import type { AuthUser } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LoginData = { email: string; password: string };
type RegisterData = { name: string; email: string; password: string };
type UpdateUserData = {
  name?: string;
  bio?: string;
  avatar?: File;
};

interface AuthState {
  authUser: AuthUser | null;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isFetchingUser: boolean;
  isUpdatingUser: boolean;
  isAuthenticated: boolean;
  getCurrentUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  registerUser: (data: RegisterData) => Promise<void>;
  loginUser: (
    data: LoginData,
    navigate: (path: string) => void
  ) => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      isRegistering: false,
      isLoggingIn: false,
      isFetchingUser: false,
      isUpdatingUser: false,
      isAuthenticated: false,
      getCurrentUser: async () => {
        set({ isFetchingUser: true });
        try {
          const res = await axiosInstance.get("/auth/current-user");
          if (res.data.success) {
            set({ authUser: res.data.data, isAuthenticated: true });
          }
        } catch (error) {
          console.log(error);
          set({ authUser: null, isAuthenticated: false });
        } finally {
          set({ isFetchingUser: false });
        }
      },
      logoutUser: async () => {
        set({ isLoggingIn: true });
        try {
          const response = await axiosInstance.get("/auth/logout");
          if (response.data.success) {
            set({ authUser: null, isAuthenticated: false });
            toast.success(response.data.message);
          }
        } catch (error) {
          console.log(error);
          set({ isAuthenticated: true });
        } finally {
          set({ isLoggingIn: false });
        }
      },
      registerUser: async () => {
        set({ isRegistering: true });
      },
      loginUser: async (data, navigate) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          if (res.data.success) {
            set({ authUser: res.data.data, isAuthenticated: true });
            navigate("/");
            toast.success(res.data.message);
          }
        } catch (error) {
          console.log(error);
        } finally {
          set({ isLoggingIn: false });
        }
      },
      updateUser: async (data) => {
        set({ isUpdatingUser: true });
        try {
          const formData = new FormData();

          if (data.name) {
            formData.append("name", data.name);
          }

          if (data.bio) {
            formData.append("bio", data.bio);
          }

          if (data.avatar) {
            formData.append("avatar", data.avatar);
          }

          const res = await axiosInstance.put("/auth/update-user", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (res.data.success) {
            set({ authUser: res.data.data });
            toast.success(res.data.message);
          }
        } catch (error) {
          console.log(error);
        } finally {
          set({ isUpdatingUser: false });
        }
      },
    }),
    {
      name: "auth",
    }
  )
);
