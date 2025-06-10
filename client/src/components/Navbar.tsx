import { Code2, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { authUser, logoutUser } = useAuthStore();
  const [scolled, setScolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav className="top-2 w-full fixed z-50">
      <div
        className={cn(
          "mx-auto max-w-6xl border-gray-800/50 rounded-xl h-14 flex items-center justify-between px-4 backdrop-blur-lg bg-black/10 shadow-2xl transition-all ease-in-out duration-500",
          scolled ? "border max-w-4xl" : "border-none max-w-6xl"
        )}
      >
        <div className="flex items-center gap-1">
          <Code2 className="text-orange-500" />
          <h1 className="text-sm font-semibold text-white">AlgoLabs</h1>
        </div>

        <div className={`hidden md:block ${scolled ? "hidden" : "block"}`}>
          <ul className="flex items-center gap-4 text-sm font-semibold text-gray-200">
            <li
              onClick={() => navigate("/")}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Home
            </li>
            <li
              onClick={() => navigate("/problems")}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Problems
            </li>
            <li
              onClick={() => navigate("/pricing")}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Pricing
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {authUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="border-2">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/username?username=${authUser?.name}`}
                    />
                    <AvatarFallback>
                      {authUser?.name.slice(0, 1) || "CN"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="flex items-center">
                    <User2 size={20} className="text-orange-500" />
                    Profile
                  </DropdownMenuItem>
                  {authUser.role === "ADMIN" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/add-problem")}
                      className="flex items-center"
                    >
                      <Code2 size={20} className="text-orange-500" /> Add
                      Problem
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutUser}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
