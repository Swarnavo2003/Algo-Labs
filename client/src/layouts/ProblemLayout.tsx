import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const ProblemLayout = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default ProblemLayout;
