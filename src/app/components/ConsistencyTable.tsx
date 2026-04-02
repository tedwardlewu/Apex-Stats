import { useState, useEffect } from "react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";

interface Consistency {
  id: number;
  driver: string;
  score: number;
  avgPosition: number;
}

export function ConsistencyTable({ compact = false }: { compact?: boolean }) {
  const { selectedSeason } = useFilters();
  const [consistency, setConsistency] = useState<Consistency[]>([]);
  const [loading, setLoading] = useState(true);
  const visibleConsistency = consistency;

  useEffect(() => {
    async function fetchConsistency() {
      try {
        setLoading(true);
        const response = await api.getConsistency({ season: selectedSeason });
        if (response.success) {
          setConsistency(response.data);
        }
      } catch (error) {
        console.error("Error fetching consistency from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConsistency();
  }, [selectedSeason]);

  if (loading) {
    return (
      <div className="rounded-[12px] border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">Loading consistency data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-100">
      <div className="border-b border-slate-200/70 p-5 dark:border-slate-700/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Driver Consistency Score</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Average result quality and week-to-week stability, shown in a tighter table.</p>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className={`w-full ${compact ? "min-w-[32rem]" : "min-w-[42rem]"}`}>
            <thead>
              <tr className="border-b border-slate-200/70 dark:border-slate-700/70">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Rank</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Driver</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Score</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Avg Pos</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Rating</th>
              </tr>
            </thead>
            <tbody>
              {visibleConsistency.map((item, index) => (
                <tr key={item.driver} className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.driver}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 max-w-[140px] flex-1 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.score}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700 dark:text-slate-200">P{item.avgPosition.toFixed(1)}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' :
                      item.score >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' :
                      item.score >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {item.score >= 90 ? 'Excellent' :
                       item.score >= 80 ? 'Very Good' :
                       item.score >= 70 ? 'Good' : 'Fair'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}