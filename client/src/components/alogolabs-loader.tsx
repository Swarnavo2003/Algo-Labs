import { useEffect, useState } from "react";

const AlgoLabsLoader = () => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const brandName = "AlgoLabs";

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < brandName.length) {
          return prev + 1;
        }
        // Reset animation after completion
        setTimeout(() => setVisibleLetters(0), 500);
        return prev;
      });
    }, 200); // Each letter appears after 200ms

    return () => clearInterval(interval);
  }, [brandName.length]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Brand Name */}
        <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mb-8">
          {brandName.split("").map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-500 ease-out transform ${
                index < visibleLetters
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-50"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Animated Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <p className="text-muted-foreground text-lg mt-6 animate-pulse">
          Preparing your coding environment...
        </p>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default AlgoLabsLoader;
