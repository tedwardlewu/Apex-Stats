import { Flag, TrendingUp, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useMemeify } from "../contexts/MemeifyContext";
import { useFilters } from "../contexts/FilterContext";
import { upcomingRaceBySeason } from "../data/upcomingRaceData";

const THEME_STORAGE_KEY = "apex-stats-theme";

const COUNTRY_FLAG_BY_KEYWORD: Record<string, string> = {
  "Japan": "/Countries/Japan.png",
  "United Arab Emirates": "/Countries/UAE.svg",
  "Abu Dhabi": "/Countries/UAE.svg",
  "Australia": "/Countries/Australia.webp",
  "China": "/Countries/China.png",
  "Bahrain": "/Countries/Bahrain.webp",
  "Saudi Arabia": "/Countries/Saudi Arabia.png",
  "USA": "/Countries/USA.png",
  "Canada": "/Countries/Canada.svg",
  "Monaco": "/Countries/Monaco.svg",
  "Spain": "/Countries/Spain.svg",
  "Austria": "/Countries/Austria.png",
  "Great Britain": "/Countries/UK.webp",
  "Belgium": "/Countries/Belgium.png",
  "Hungary": "/Countries/Hungary.png",
  "Netherlands": "/Countries/Dutch.webp",
  "Italy": "/Countries/Italy.webp",
  "Azerbaijan": "/Countries/Azerbaijan.svg",
  "Singapore": "/Countries/Singapore.png",
  "Mexico": "/Countries/Mexico.svg",
  "Brazil": "/Countries/Brazil.webp",
  "Qatar": "/Countries/Qatar.png",
};

function getRaceFlagPath(location: string) {
  const match = Object.entries(COUNTRY_FLAG_BY_KEYWORD).find(([keyword]) => location.includes(keyword));
  return match?.[1] ?? null;
}

function formatCountdown(targetDate: string) {
  const now = Date.now();
  const target = new Date(`${targetDate}T00:00:00`).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return "Race Weekend Live";
  }

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  return `${days}d ${hours}h`;
}

function formatRaceDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Header() {
  const { memeify, toggleMemeify } = useMemeify();
  const { selectedSeason } = useFilters();
  const upcomingRace = upcomingRaceBySeason[selectedSeason];
  const raceFlagPath = upcomingRace ? getRaceFlagPath(upcomingRace.country) : null;
  const [countdown, setCountdown] = useState(
    upcomingRace ? formatCountdown(upcomingRace.date) : "Calendar pending",
  );
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

  useEffect(() => {
    if (!upcomingRace) {
      setCountdown("Calendar pending");
      return;
    }

    setCountdown(formatCountdown(upcomingRace.date));

    const interval = window.setInterval(() => {
      setCountdown(formatCountdown(upcomingRace.date));
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, [upcomingRace]);

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
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">Apex Stats</h1>
                  <button
                    onClick={toggleMemeify}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold shadow-md ring-1 ring-white/20 transition ${
                      memeify
                        ? "border-yellow-200 bg-yellow-400 text-red-950 hover:bg-yellow-300"
                        : "border-red-200/70 bg-red-950/45 text-red-50 hover:bg-red-900/60"
                    }`}
                    title="Toggle meme driver and team images"
                  >
                    Memeify
                  </button>
                </div>
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

        {upcomingRace ? (
          <div className="mt-4 rounded-2xl border border-white/30 bg-black/20 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <div>
                {raceFlagPath ? (
                  <img
                    src={raceFlagPath}
                    alt={upcomingRace.country}
                    className="h-10 w-14 rounded-md object-cover shadow-md"
                  />
                ) : (
                  <div className="h-10 w-14 rounded-md bg-red-950/40" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-100">Next Race Countdown</p>
                <h2 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
                  {upcomingRace.name} · {countdown}
                </h2>
                <p className="mt-1 text-sm text-red-100">
                  {upcomingRace.circuit}, {upcomingRace.country} · {formatRaceDate(upcomingRace.date)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
