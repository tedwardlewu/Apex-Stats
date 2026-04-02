import { useState, useEffect } from "react";
import { CalendarDays, Flag } from "lucide-react";
import * as api from "../services/api";

const COUNTRY_FLAG: Record<string, string> = {
  Australia: "/Countries/Australia.webp",
  China: "/Countries/China.png",
  Japan: "/Countries/Japan.png",
  Bahrain: "/Countries/Bahrain.webp",
  "Saudi Arabia": "/Countries/Saudi Arabia.png",
  USA: "/Countries/USA.png",
  "United States": "/Countries/USA.png",
  Italy: "/Countries/Italy.webp",
  Monaco: "/Countries/Monaco.svg",
  Spain: "/Countries/Spain.svg",
  Canada: "/Countries/Canada.svg",
  Austria: "/Countries/Austria.png",
  UK: "/Countries/UK.webp",
  "United Kingdom": "/Countries/UK.webp",
  Belgium: "/Countries/Belgium.png",
  Hungary: "/Countries/Hungary.png",
  Netherlands: "/Countries/Dutch.webp",
  Azerbaijan: "/Countries/Azerbaijan.svg",
  Singapore: "/Countries/Singapore.png",
  Mexico: "/Countries/Mexico.svg",
  Brazil: "/Countries/Brazil.webp",
  Qatar: "/Countries/Qatar.png",
  UAE: "/Countries/UAE.svg",
  "United Arab Emirates": "/Countries/UAE.svg",
};

function resolveCountryFlag(country: string) {
  const exactMatch = COUNTRY_FLAG[country.trim()];

  if (exactMatch) {
    return exactMatch;
  }

  const key = Object.keys(COUNTRY_FLAG).find((entry) => country.includes(entry));
  return key ? COUNTRY_FLAG[key] : null;
}

interface Race {
  id: number;
  name: string;
  country: string;
  date: string;
  circuit: string;
  winner: string;
  fastestLap: string;
}

export function RecentRaces({
  onViewResults,
  onViewCalendar,
}: {
  onViewResults: () => void;
  onViewCalendar: () => void;
}) {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRaces() {
      try {
        setLoading(true);
        const response = await api.getRaces();
        if (response.success) {
          setRaces(response.data);
        }
      } catch (error) {
        console.error("Error fetching races from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRaces();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[12px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[10px] bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="flex flex-col gap-4 border-b border-slate-200/70 p-6 dark:border-slate-700/70 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Races</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewResults}
            className="inline-flex items-center gap-2 rounded-[10px] border border-sky-300/90 bg-white px-3.5 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-[1px] hover:border-sky-400 hover:text-sky-800 hover:shadow dark:border-sky-800/80 dark:bg-slate-900 dark:text-sky-300 dark:hover:border-sky-700 dark:hover:text-sky-200"
          >
            <Flag className="size-4" />
            <span>Results</span>
          </button>
          <button
            type="button"
            onClick={onViewCalendar}
            className="inline-flex items-center gap-2 rounded-[10px] border border-sky-300/90 bg-white px-3.5 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-[1px] hover:border-sky-400 hover:text-sky-800 hover:shadow dark:border-sky-800/80 dark:bg-slate-900 dark:text-sky-300 dark:hover:border-sky-700 dark:hover:text-sky-200"
          >
            <CalendarDays className="size-4" />
            <span>2026 Calendar</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {races.map((race) => (
            <div
              key={race.id}
              className="rounded-[10px] bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{race.name}</h3>
                    {resolveCountryFlag(race.country) ? (
                      <img
                        src={resolveCountryFlag(race.country) ?? ""}
                        alt={`${race.country} flag`}
                        className="h-4 w-6 shrink-0 rounded-[2px] object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{race.circuit}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{race.country}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>{new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 dark:border-slate-700/60">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Winner</p>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-1 rounded-full bg-yellow-500" />
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{race.winner}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Fastest Lap</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{race.fastestLap}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}