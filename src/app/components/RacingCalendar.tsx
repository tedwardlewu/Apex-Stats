import { Calendar } from "lucide-react";
import { useFilters } from "../contexts/FilterContext";
import { raceCalendarBySeason } from "../data/raceCalendarData";

const COUNTRY_FLAG: Record<string, string> = {
  "Australia": "/Countries/Australia.webp",
  "China": "/Countries/China.png",
  "Japan": "/Countries/Japan.png",
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
  "Abu Dhabi": "/Countries/UAE.svg",
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const sameMonth = start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.toLocaleDateString("en-GB", { month: "short" })} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${start.toLocaleDateString("en-GB", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}`;
}

export function RacingCalendar() {
  const { selectedSeason } = useFilters();
  const races = raceCalendarBySeason[selectedSeason] ?? [];

  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Calendar</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{selectedSeason} Racing Calendar</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Calendar className="size-4" />
          {races.length} race weekends
        </div>
      </div>

      {races.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          No calendar data is available for the selected season.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900/70">
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Round</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Country</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Venue</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Weekend</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => (
                <tr key={race.round} className="border-b border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                      {race.round}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatDateRange(race.startDate, race.endDate)}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-2">
                      {COUNTRY_FLAG[race.country] ? (
                        <img
                          src={COUNTRY_FLAG[race.country]}
                          alt={race.country}
                          className="h-4 w-6 rounded-sm object-cover shadow-sm"
                        />
                      ) : null}
                      {race.country}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{race.venue}</span>
                      {race.note ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                          {race.note}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {race.sprint ? (
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        Sprint
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Standard
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
