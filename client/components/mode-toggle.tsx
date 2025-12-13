"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg text-gray-500">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
      title="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <FiSun
          className={`absolute inset-0 w-full h-full transition-all duration-300 ${theme === "dark" ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
        />
        <FiMoon
          className={`absolute inset-0 w-full h-full transition-all duration-300 ${theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
