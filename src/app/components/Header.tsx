import { Flag, TrendingUp, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useMemeify } from "../contexts/MemeifyContext";
import { useFilters } from "../contexts/FilterContext";
import { upcomingRaceBySeason } from "../data/upcomingRaceData";

const THEME_STORAGE_KEY = "apex-stats-theme";

const countryFlagByKeyword: Array<{ keyword: string; flagPath: string; label: string }> = [
  { keyword: "japan", flagPath: "/Countries/Japan.png", label: "Japan" },
  { keyword: "united arab emirates", flagPath: "/Countries/UAE.svg", label: "United Arab Emirates" },
  { keyword: "uae", flagPath: "/Countries/UAE.svg", label: "United Arab Emirates" },
  { keyword: "australia", flagPath: "/Countries/Australia.webp", label: "Australia" },
  { keyword: "great britain", flagPath: "/Countries/UK.webp", label: "Great Britain" },
  { keyword: "united kingdom", flagPath: "/Countries/UK.webp", label: "United Kingdom" },
  { keyword: "italy", flagPath: "/Countries/Italy.webp", label: "Italy" },
  { keyword: "monaco", flagPath: "/Countries/Monaco.svg", label: "Monaco" },
  { keyword: "spain", flagPath: "/Countries/Spain.svg", label: "Spain" },
  { keyword: "canada", flagPath: "/Countries/Canada.svg", label: "Canada" },
  { keyword: "bahrain", flagPath: "/Countries/Bahrain.webp", label: "Bahrain" },
  { keyword: "saudi arabia", flagPath: "/Countries/Saudi Arabia.png", label: "Saudi Arabia" },
  { keyword: "qatar", flagPath: "/Countries/Qatar.png", label: "Qatar" },
  { keyword: "usa", flagPath: "/Countries/USA.png", label: "United States" },
  { keyword: "united states", flagPath: "/Countries/USA.png", label: "United States" },
  { keyword: "mexico", flagPath: "/Countries/Mexico.svg", label: "Mexico" },
  { keyword: "brazil", flagPath: "/Countries/Brazil.webp", label: "Brazil" },
  { keyword: "singapore", flagPath: "/Countries/Singapore.png", label: "Singapore" },
  { keyword: "austria", flagPath: "/Countries/Austria.png", label: "Austria" },
  { keyword: "belgium", flagPath: "/Countries/Belgium.png", label: "Belgium" },
  { keyword: "hungary", flagPath: "/Countries/Hungary.png", label: "Hungary" },
  { keyword: "netherlands", flagPath: "/Countries/Dutch.webp", label: "Netherlands" },
  { keyword: "azerbaijan", flagPath: "/Countries/Azerbaijan.svg", label: "Azerbaijan" },
  { keyword: "china", flagPath: "/Countries/China.png", label: "China" },
];

function getRaceCountryFlag(country: string) {
  const normalized = country.toLowerCase();
  return countryFlagByKeyword.find((entry) => normalized.includes(entry.keyword));
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
  const raceFlag = upcomingRace ? getRaceCountryFlag(upcomingRace.country) : undefined;

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
    <header className="border-b border-red-900/30 bg-gradient-to-r from-red-700 via-red-700 to-red-800 text-white">
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
                    className={`rounded-full border-2 px-5 py-2 text-sm font-black uppercase tracking-[0.08em] shadow-[0_0_0_2px_rgba(255,255,255,0.18)] transition ${
                      memeify
                        ? "border-yellow-100 bg-yellow-300 text-red-950 hover:bg-yellow-200"
                        : "animate-pulse border-yellow-200 bg-red-950/55 text-yellow-100 hover:bg-red-900/70"
                    }`}
                    title="Toggle meme driver and team images"
                  >
                    {memeify ? "Meme version on" : "Click for meme version"}
                  </button>
                </div>
                <p className="text-sm text-red-100">Formula 1 Analytics Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={toggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-red-950/45 text-yellow-300 transition hover:bg-red-900/60"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <TrendingUp className="size-4" />
            <span>2026 Season</span>
          </div>
        </div>

        {upcomingRace ? (
          <div className="mt-4 rounded-2xl border border-white/25 bg-black/15 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              {raceFlag ? (
                <img
                  src={raceFlag.flagPath}
                  alt={`${raceFlag.label} flag`}
                  className="h-5 w-5 rounded-full border border-white/45 object-cover"
                />
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-100">Next Race Countdown</p>
            </div>
            <h2 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
              {upcomingRace.name} · {countdown}
            </h2>
            <p className="mt-1 text-sm text-red-100">
              {upcomingRace.circuit}, {upcomingRace.country} · {formatRaceDate(upcomingRace.date)}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
