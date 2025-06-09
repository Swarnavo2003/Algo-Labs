import { Code } from "lucide-react";

const AuthImage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="relative h-screen hidden md:block">
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-black [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [&>div]:bg-[size:14px_24px]">
          <div></div>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <div className=" backdrop-blur-2xl bg-black/30 rounded-full p-6 shadow-lg shadow-orange-800 mb-2 inline-block border-2 border-orange-600">
            <Code className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="mb-8 text-2xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">
            {title}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthImage;
