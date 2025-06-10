import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />
      <div className="h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
