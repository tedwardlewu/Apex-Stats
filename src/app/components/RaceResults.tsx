import { useEffect, useMemo, useState } from "react";
import { Flag, MapPinned, TimerReset, Trophy } from "lucide-react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamDisplayName, getTeamImage, getTeamImageStyle } from "../utils/teamImages";

interface Race {
  id: number;
  name: string;
  country: string;
  date: string;
  circuit: string;
}

interface Driver {
  name: string;
  image?: string;
}

interface Team {
  name: string;
  image?: string;
}

interface RaceResultEntry {
  positionLabel: string;
  carNumber: number;
  driverName: string;
  team: string;
  points: number;
  lapsCompleted: number;
  result: string;
}

const TEAM_COLORS: Record<string, string> = {
  Mercedes: "#06B6D4",
  Ferrari: "#DC2626",
  McLaren: "#F97316",
  "Red Bull Racing": "#1c46ce",
  "Haas F1 Team": "#6b7280",
  "Racing Bulls": "#7594c2",
  Audi: "#771716",
  Alpine: "#2871cb",
  Williams: "#104fb4",
  Cadillac: "#444749",
  "Aston Martin": "#10853b",
};

function getClassificationLabel(entry: RaceResultEntry) {
  if (entry.positionLabel !== "NC") {
    return `P${entry.positionLabel}`;
  }

  if (entry.result === "DNS") {
    return "DNS";
  }

  return "DNF";
}

export function RaceResults() {
  const { selectedSeason } = useFilters();
  const { memeify } = useMemeify();
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [race, setRace] = useState<Race | null>(null);
  const [results, setResults] = useState<RaceResultEntry[]>([]);
  const [driverImages, setDriverImages] = useState<Record<string, string>>({});
  const [teamImages, setTeamImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchResultsContext() {
      try {
        setLoading(true);
        const [racesResponse, driversResponse, teamsResponse] = await Promise.all([
          api.getRaces({ season: selectedSeason }),
          api.getDrivers({ season: selectedSeason }),
          api.getTeams({ season: selectedSeason }),
        ]);

        if (!isMounted) {
          return;
        }

        if (racesResponse.success) {
          setRaces(racesResponse.data);
          setSelectedRaceId((currentRaceId) => currentRaceId ?? racesResponse.data[racesResponse.data.length - 1]?.id ?? null);
        }

        if (driversResponse.success) {
          setDriverImages(
            driversResponse.data.reduce<Record<string, string>>((accumulator: Record<string, string>, driver: Driver) => {
              if (driver.image) {
                accumulator[driver.name] = driver.image;
              }
              return accumulator;
            }, {}),
          );
        }

        if (teamsResponse.success) {
          setTeamImages(
            teamsResponse.data.reduce<Record<string, string>>((accumulator: Record<string, string>, team: Team) => {
              if (team.image) {
                accumulator[team.name] = team.image;
              }
              return accumulator;
            }, {}),
          );
        }
      } catch (error) {
        console.error("Error fetching latest race results context:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchResultsContext();

    return () => {
      isMounted = false;
    };
  }, [selectedSeason]);

  useEffect(() => {
    let isMounted = true;

    async function fetchResultsForRace() {
      if (!selectedRaceId) {
        setRace(null);
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getRaceResults({ season: selectedSeason, raceId: selectedRaceId });

        if (!isMounted || !response.success) {
          return;
        }

        setRace(response.data.race);
        setResults(response.data.results);
      } catch (error) {
        console.error("Error fetching race results:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchResultsForRace();

    return () => {
      isMounted = false;
    };
  }, [selectedRaceId, selectedSeason]);

  const winner = useMemo(
    () => results.find((entry) => entry.positionLabel !== "NC") ?? null,
    [results],
  );
  const winnerBackgroundImage = winner ? "/News/Kimi Background.jpg" : "";

  if (loading) {
    return (
      <div className="rounded-[24px] border border-slate-700/70 bg-[linear-gradient(180deg,_rgba(15,23,42,0.94),_rgba(17,24,39,0.94))] p-6 text-gray-200">
        <p className="text-center text-gray-300">Loading race results...</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-700/70 bg-[linear-gradient(180deg,_rgba(15,23,42,0.97),_rgba(17,24,39,0.97))] text-gray-200">
      <div className="border-b border-slate-700/70 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Results</p>
            <div className="mt-2 flex items-center gap-2">
              <Flag className="size-5 text-red-500" />
              <h2 className="text-2xl font-semibold text-white">Race Classification</h2>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Round</label>
            <select
              value={selectedRaceId ?? ""}
              onChange={(event) => setSelectedRaceId(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-600 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/25"
            >
              {races.map((availableRace) => (
                <option key={availableRace.id} value={availableRace.id}>
                  {availableRace.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {race && results.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-[20px] border border-slate-700/70 bg-slate-900/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Event</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{race.name}</h3>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/70 px-3 py-1.5">
                    <MapPinned className="size-4 text-red-400" />
                    <span>{race.country}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/70 px-3 py-1.5">
                    <TimerReset className="size-4 text-cyan-400" />
                    <span>{race.circuit}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  {new Date(race.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-[20px] border border-amber-500/30 bg-[linear-gradient(135deg,_rgba(120,53,15,0.15),_rgba(15,23,42,0.9))] p-5">
                {winnerBackgroundImage ? (
                  <div
                    className="pointer-events-none absolute inset-0 scale-[1.03] bg-cover bg-no-repeat opacity-95 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:scale-[1.08]"
                    style={{
                      backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.52) 44%, rgba(15,23,42,0.16) 100%), url("${encodeURI(winnerBackgroundImage)}")`,
                      backgroundPosition: "center 4%",
                    }}
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/8" />

                <div className="relative z-10">
                <div className="flex items-center gap-2 text-amber-300">
                  <Trophy className="size-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.24em]">Winner</p>
                </div>
                {winner ? (
                  <div className="mt-4 flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-700"
                      style={{ backgroundColor: winner.team === "Ferrari" ? "#c92c2c" : TEAM_COLORS[winner.team] || "#222" }}
                    >
                      <img
                        src={getDriverImage(winner.driverName, driverImages[winner.driverName] ?? "/Driver Images/Max.avif", memeify)}
                        alt={getDriverDisplayName(winner.driverName, memeify)}
                        className="h-14 w-14 rounded-full object-cover object-[center_-10%]"
                        style={getDriverImageStyle(winner.driverName, memeify)}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{getDriverDisplayName(winner.driverName, memeify)}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                        {teamImages[winner.team] ? (
                          <img
                            src={getTeamImage(winner.team, teamImages[winner.team], memeify)}
                            alt={getTeamDisplayName(winner.team, memeify)}
                            className="h-6 w-6 rounded-full border border-gray-700"
                            style={{
                              ...getTeamImageStyle(winner.team, memeify),
                              backgroundColor: winner.team === "Ferrari" ? "#c92c2c" : TEAM_COLORS[winner.team] || "#222",
                            }}
                          />
                        ) : null}
                        <span>{getTeamDisplayName(winner.team, memeify)}</span>
                      </div>
                      <p className="mt-2 text-sm text-amber-200">{winner.result} • {winner.points} pts</p>
                    </div>
                  </div>
                ) : null}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full overflow-hidden rounded-[20px] border border-slate-700/70 bg-slate-900/60 text-sm">
                <thead className="bg-slate-950/70">
                  <tr className="text-left text-slate-400">
                    <th className="px-4 py-4 font-medium">Pos</th>
                    <th className="px-4 py-4 font-medium">No.</th>
                    <th className="px-4 py-4 font-medium">Driver</th>
                    <th className="px-4 py-4 font-medium">Team</th>
                    <th className="px-4 py-4 font-medium">Laps</th>
                    <th className="px-4 py-4 font-medium">Time / Retired</th>
                    <th className="px-4 py-4 text-right font-medium">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/90">
                  {results.map((entry) => (
                    <tr key={`${entry.positionLabel}-${entry.driverName}`} className="text-slate-200 transition hover:bg-white/[0.03]">
                      <td className="px-4 py-3.5">
                        <span className="inline-flex min-w-12 items-center justify-center rounded-full border border-slate-700/70 bg-slate-950/70 px-3 py-1 font-semibold">
                          {getClassificationLabel(entry)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-300">{entry.carNumber}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-700"
                            style={{ backgroundColor: entry.team === "Ferrari" ? "#c92c2c" : TEAM_COLORS[entry.team] || "#222" }}
                          >
                            <img
                              src={getDriverImage(entry.driverName, driverImages[entry.driverName] ?? "/Driver Images/Max.avif", memeify)}
                              alt={getDriverDisplayName(entry.driverName, memeify)}
                              className="h-10 w-10 rounded-full object-cover object-[center_-10%]"
                              style={getDriverImageStyle(entry.driverName, memeify)}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{getDriverDisplayName(entry.driverName, memeify)}</p>
                            <p className="text-xs text-slate-400">#{entry.carNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {teamImages[entry.team] ? (
                            <img
                              src={getTeamImage(entry.team, teamImages[entry.team], memeify)}
                              alt={getTeamDisplayName(entry.team, memeify)}
                              className="h-8 w-8 rounded-full border border-gray-700"
                              style={{
                                ...getTeamImageStyle(entry.team, memeify),
                                backgroundColor: entry.team === "Ferrari" ? "#c92c2c" : TEAM_COLORS[entry.team] || "#222",
                              }}
                            />
                          ) : null}
                          <span>{getTeamDisplayName(entry.team, memeify)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">{entry.lapsCompleted}</td>
                      <td className="px-4 py-3.5 text-slate-300">{entry.result}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-white">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No race results are available for the selected round.</p>
        )}
      </div>
    </section>
  );
}