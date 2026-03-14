import { Flag, TrendingUp, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "apex-stats-theme";

export function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", darkMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <header className="border-b bg-gradient-to-r from-red-700 to-red-800 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Flag className="size-8" />
              <div>
                <h1 className="text-2xl font-bold">Apex Stats</h1>
                <p className="text-sm text-red-100">Formula 1 Analytics Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-700 bg-gray-900 text-yellow-400 hover:bg-gray-700 transition"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <TrendingUp className="size-4" />
            <span>2026 Season</span>
          </div>
        </div>
      </div>
    </header>
  );
}
