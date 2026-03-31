import { useState, useEffect } from "react";
import * as api from "../services/api";

interface Race {
  id: number;
  name: string;
  country: string;
  date: string;
  circuit: string;
  winner: string;
  fastestLap: string;
}

export function RecentRaces() {
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
      <div className="rounded-[16px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[12px] bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="border-b border-slate-200/70 p-6 dark:border-slate-700/70">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Races</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {races.map((race) => (
            <div
              key={race.id}
              className="rounded-[12px] bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{race.name}</h3>
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