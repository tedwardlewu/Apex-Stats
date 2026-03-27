import { useEffect, useState } from "react";
import { Shield, Trophy } from "lucide-react";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import * as api from "../services/api";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamDisplayName, getTeamImage, getTeamImageStyle } from "../utils/teamImages";

interface DriverSnapshot {
  id: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  image: string;
}

interface TeamSnapshot {
  id: number;
  name: string;
  color: string;
  points: number;
  wins: number;
  image: string;
}

const teamAliases: Record<string, string[]> = {
  "Red Bull Racing": ["Red Bull Racing"],
  Ferrari: ["Ferrari"],
  McLaren: ["McLaren"],
  Mercedes: ["Mercedes"],
  Williams: ["Williams"],
  "Aston Martin": ["Aston Martin"],
  RB: ["RB", "Racing Bulls"],
  "Racing Bulls": ["Racing Bulls"],
  Haas: ["Haas", "Haas F1 Team"],
  "Haas F1 Team": ["Haas F1 Team"],
  Alpine: ["Alpine"],
  "Kick Sauber": ["Kick Sauber", "Audi", "Sauber"],
  Sauber: ["Sauber", "Kick Sauber", "Audi"],
  Audi: ["Audi", "Kick Sauber", "Sauber"],
  Cadillac: ["Cadillac"],
};

const teamLogoBackgrounds: Record<string, string> = {
  Mercedes: "#06B6D4",
  Ferrari: "#c92c2c",
  McLaren: "#F97316",
  "Red Bull Racing": "#1c46ce",
  Williams: "#104fb4",
  Cadillac: "#444749",
  "Aston Martin": "#10853b",
  Audi: "#771716",
  "Kick Sauber": "#39FF14",
  Sauber: "#39FF14",
  Alpine: "#2871cb",
  "Haas F1 Team": "#d1d1d1",
  "Racing Bulls": "#7594c2",
};

function matchesSelectedTeam(teamName: string, selectedTeam: string) {
  if (selectedTeam === "all") {
    return true;
  }

  return (teamAliases[selectedTeam] ?? [selectedTeam]).includes(teamName);
}

function SnapshotColumn({
  title,
  icon: Icon,
  emptyMessage,
  children,
}: {
  title: string;
  icon: typeof Trophy;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[16px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="flex items-center gap-2 border-b border-slate-200/70 pb-4 dark:border-slate-700/70">
        <Icon className="size-5 text-red-600" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children || <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>}</div>
    </article>
  );
}

export function ChampionshipSnapshot() {
  const { selectedSeason, selectedTeam, searchQuery } = useFilters();
  const { memeify } = useMemeify();
  const [drivers, setDrivers] = useState<DriverSnapshot[]>([]);
  const [teams, setTeams] = useState<TeamSnapshot[]>([]);
  const [allTeams, setAllTeams] = useState<TeamSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSnapshot() {
      try {
        setLoading(true);

        const [driverResponse, teamResponse] = await Promise.all([
          api.getDrivers({ season: selectedSeason, team: selectedTeam, search: searchQuery }),
          api.getTeams({ season: selectedSeason }),
        ]);

        if (!isMounted) {
          return;
        }

        if (driverResponse.success) {
          setDrivers(driverResponse.data.slice(0, 3));
        }

        if (teamResponse.success) {
          setAllTeams(teamResponse.data);

          const visibleTeams = teamResponse.data
            .filter((team) => matchesSelectedTeam(team.name, selectedTeam))
            .sort((left, right) => right.points - left.points)
            .slice(0, 3);

          setTeams(visibleTeams);
        }
      } catch (error) {
        console.error("Error fetching championship snapshot:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSnapshot();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedSeason, selectedTeam]);

  return (
    <section className="mb-8 rounded-[18px] border border-slate-200/70 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60">
      <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Overview</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Championship snapshot</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SnapshotColumn
          title={selectedTeam === "all" && !searchQuery ? "Top drivers" : "Filtered drivers"}
          icon={Trophy}
          emptyMessage="No drivers match the current filters."
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-[14px] bg-slate-100 dark:bg-slate-800" />
              ))
            : drivers.map((driver, index) => (
                <div key={driver.id} className="flex items-center justify-between gap-4 rounded-[14px] bg-slate-50 px-4 py-4 dark:bg-slate-800/70">
                  {(() => {
                    const matchedTeam =
                      allTeams.find((team) => team.name === driver.team) ??
                      allTeams.find((team) => {
                        const driverAliases = teamAliases[driver.team] ?? [driver.team];
                        const teamAliasesForCandidate = teamAliases[team.name] ?? [team.name];

                        return driverAliases.includes(team.name) || teamAliasesForCandidate.includes(driver.team);
                      });

                    return (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-800">
                        <img
                          src={getDriverImage(driver.name, driver.image, memeify)}
                          alt={getDriverDisplayName(driver.name, memeify)}
                          className="h-full w-full object-cover object-[center_-10%]"
                          style={getDriverImageStyle(driver.name, memeify)}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            P{index + 1}
                          </span>
                          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{getDriverDisplayName(driver.name, memeify)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {matchedTeam?.image ? (
                            <img
                              src={getTeamImage(matchedTeam.name, matchedTeam.image, memeify)}
                              alt={`${getTeamDisplayName(driver.team, memeify)} logo`}
                              className="h-4 w-4 rounded-full border border-slate-300 object-cover dark:border-slate-600"
                              style={{
                                ...getTeamImageStyle(matchedTeam.name, memeify),
                                backgroundColor: teamLogoBackgrounds[matchedTeam.name] ?? matchedTeam.color ?? "#334155",
                              }}
                            />
                          ) : null}
                          <p className="truncate text-sm text-slate-600 dark:text-slate-300">{getTeamDisplayName(driver.team, memeify)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                    );
                  })()}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{driver.points} pts</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{driver.wins} wins</p>
                  </div>
                </div>
              ))}
        </SnapshotColumn>

        <SnapshotColumn
          title={selectedTeam === "all" ? "Top constructors" : "Selected constructors"}
          icon={Shield}
          emptyMessage="No teams match the current filters."
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-[14px] bg-slate-100 dark:bg-slate-800" />
              ))
            : teams.map((team, index) => (
                <div key={team.id} className="flex items-center justify-between gap-4 rounded-[14px] bg-slate-50 px-4 py-4 dark:bg-slate-800/70">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 dark:border-slate-700"
                      style={{ backgroundColor: teamLogoBackgrounds[team.name] ?? team.color ?? "#334155" }}
                    >
                      <img
                        src={getTeamImage(team.name, team.image, memeify)}
                        alt={getTeamDisplayName(team.name, memeify)}
                        className="h-full w-full object-cover object-top"
                        style={getTeamImageStyle(team.name, memeify)}
                      />
                    </div>
                    <div className="h-10 w-2 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          P{index + 1}
                        </span>
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{getTeamDisplayName(team.name, memeify)}</p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Constructor campaign</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{team.points} pts</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{team.wins} wins</p>
                  </div>
                </div>
              ))}
        </SnapshotColumn>
      </div>
    </section>
  );
}