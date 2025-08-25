import LoginForm from "@/components/auth/LoginForm";
import { Code2 } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="h-screen w-full grid grid-cols-2">
      <div className="relative h-screen hidden md:block">
        <div className="absolute inset-0">
          <div className="relative h-full w-full bg-black [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [&>div]:bg-[size:14px_24px]">
            <div></div>
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          <div className="max-w-3xl text-center border-3 border-white p-8 rounded-full">
            <Code2 className="size-30 " />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full h-screen">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
