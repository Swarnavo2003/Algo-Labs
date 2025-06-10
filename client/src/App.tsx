import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProblemsPage from "./pages/problems/ProblemsPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProblemLayout from "./layouts/ProblemLayout";
import AdminLayout from "./layouts/AdminLayout";
import AddProblemPage from "./pages/admin/AddProblemPage";

function App() {
  const { authUser, getCurrentUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
      />
      <Route element={<ProblemLayout />}>
        <Route
          path="/problems"
          element={authUser ? <ProblemsPage /> : <Navigate to="/login" />}
        />
      </Route>
      <Route element={<AdminLayout />}>
        <Route
          path="/add-problem"
          element={authUser ? <AddProblemPage /> : <Navigate to="/login" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
