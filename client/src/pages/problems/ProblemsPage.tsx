const ProblemsPage = () => {
  return (
    <div className="relative w-full min-h-screen top-20">
      <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-orange-600 opacity-30 blur-3xl rounded-md bottom-9"></div>
      <div className="mx-auto min-h-screen max-w-6xl h-full flex flex-col items-center mt-10">
        <h1 className="text-2xl md:text-4xl font-bold tracking-wider ">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-orange-800 via-orange-600 to-orange-400 bg-clip-text text-transparent">
            AlgoLabs
          </span>
        </h1>
        <p className="mt-5 text-xs md:text-sm text-gray-400 font-semibold">
          A platform inspired by leetcode which will help you prepare for coding
          interviews and helps you improve your problem solving skills by
          solving coding problems
        </p>
      </div>
    </div>
  );
};

export default ProblemsPage;
