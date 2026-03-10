import { Flag, TrendingUp, Moon, Sun } from "lucide-react";
import { useState } from "react";
export function Header() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const html = document.documentElement;
      if (!prev) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      return !prev;
    });
  };

  return (
    <header className="border-b bg-gradient-to-r from-red-600 to-red-700 text-white">
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
