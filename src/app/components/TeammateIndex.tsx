import { useEffect, useMemo, useState } from "react";
import { Users2 } from "lucide-react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamDisplayName, getTeamImage } from "../utils/teamImages";

interface Driver {
  id: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
  image: string;
}

interface Pairing {
  team: string;
  leader: Driver;
  teammate: Driver;
  pointsGap: number;
  winsGap: number;
  podiumGap: number;
  combinedPoints: number;
  combinedWins: number;
  combinedPodiums: number;
  leaderSharePct: number;
  teammateSharePct: number;
  balanceScore: number;
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

const teamColors: Record<string, string> = {
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

const teamLogoImages: Record<string, string> = {
  Mercedes: "/Team Images/Mercedes.avif",
  Ferrari: "/Team Images/Ferrari.avif",
  McLaren: "/Team Images/McLaren.avif",
  "Red Bull Racing": "/Team Images/Redbull.avif",
  Williams: "/Team Images/Williams.avif",
  Cadillac: "/Team Images/Cadillac.avif",
  "Aston Martin": "/Team Images/Aston.avif",
  Audi: "/Team Images/Audi.avif",
  "Kick Sauber": "/Team Images/Sauber.avif",
  Sauber: "/Team Images/Sauber.avif",
  Alpine: "/Team Images/Alpine.avif",
  "Haas F1 Team": "/Team Images/Haas.avif",
  "Racing Bulls": "/Team Images/Racingbulls.avif",
};

function matchesSelectedTeam(teamName: string, selectedTeam: string) {
  if (selectedTeam === "all") {
    return true;
  }

  return (teamAliases[selectedTeam] ?? [selectedTeam]).includes(teamName);
}

function InsightDriver({ driver, memeify }: { driver: Driver; memeify: boolean }) {
  const displayName = getDriverDisplayName(driver.name, memeify);

  return (
    <div className="mt-1 flex items-center gap-2">
      <img
        src={getDriverImage(driver.name, driver.image, memeify)}
        alt={displayName}
        className="h-5 w-5 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
        style={getDriverImageStyle(driver.name, memeify)}
      />
      <p className="truncate text-[11px] font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
    </div>
  );
}

export function TeammateIndex() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { selectedSeason, selectedTeam } = useFilters();
  const { memeify } = useMemeify();

  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        const response = await api.getDrivers({ season: selectedSeason });
        if (response.success) {
          setDrivers(response.data);
        }
      } catch (error) {
        console.error("Error fetching drivers for teammate index:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, [selectedSeason]);

  const pairings = useMemo<Pairing[]>(() => {
    const byTeam = new Map<string, Driver[]>();

    for (const driver of drivers) {
      if (!matchesSelectedTeam(driver.team, selectedTeam)) {
        continue;
      }

      const teamDrivers = byTeam.get(driver.team) ?? [];
      teamDrivers.push(driver);
      byTeam.set(driver.team, teamDrivers);
    }

    const rows: Pairing[] = [];

    byTeam.forEach((teamDrivers, team) => {
      if (teamDrivers.length < 2) {
        return;
      }

      const [leader, teammate] = [...teamDrivers].sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        if (b.podiums !== a.podiums) {
          return b.podiums - a.podiums;
        }

        return a.name.localeCompare(b.name);
      });
      const total = leader.points + teammate.points;
      const leaderSharePct = total > 0 ? Math.round((leader.points / total) * 100) : 50;

      rows.push({
        team,
        leader,
        teammate,
        pointsGap: leader.points - teammate.points,
        winsGap: leader.wins - teammate.wins,
        podiumGap: leader.podiums - teammate.podiums,
        combinedPoints: total,
        combinedWins: leader.wins + teammate.wins,
        combinedPodiums: leader.podiums + teammate.podiums,
        leaderSharePct,
        teammateSharePct: 100 - leaderSharePct,
        balanceScore: Math.max(0, 100 - Math.abs(leaderSharePct - 50) * 2),
      });
    });

    return rows.sort((a, b) => b.pointsGap - a.pointsGap);
  }, [drivers, selectedTeam]);

  const insights = useMemo(() => {
    if (pairings.length === 0) {
      return null;
    }

    const closestBattle = [...pairings].sort((a, b) => a.pointsGap - b.pointsGap)[0];
    const biggestGap = pairings[0];
    const strongestDuo = [...pairings].sort((a, b) => b.combinedPoints - a.combinedPoints)[0];
    const mostBalanced = [...pairings].sort((a, b) => b.balanceScore - a.balanceScore)[0];

    return {
      closestBattle,
      biggestGap,
      strongestDuo,
      mostBalanced,
    };
  }, [pairings]);

  const visiblePairings = showAll ? pairings : pairings.slice(0, 4);

  if (loading) {
    return (
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading teammate index...</p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users2 className="size-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Teammate Index</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {pairings.length} teams
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Compact head-to-head view using points share, wins, and podiums.
        </p>
      </div>

      <div className="space-y-3 p-4">
        {pairings.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No teammate data available for the selected filters.</p>
        ) : (
          <>
            {insights ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Closest Battle</p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{getTeamDisplayName(insights.closestBattle.team, memeify)}</p>
                  <InsightDriver driver={insights.closestBattle.leader} memeify={memeify} />
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{insights.closestBattle.pointsGap} pts gap</p>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Biggest Gap</p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{getTeamDisplayName(insights.biggestGap.team, memeify)}</p>
                  <InsightDriver driver={insights.biggestGap.teammate} memeify={memeify} />
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{insights.biggestGap.pointsGap} pts gap</p>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Strongest Duo</p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{getTeamDisplayName(insights.strongestDuo.team, memeify)}</p>
                  <InsightDriver driver={insights.strongestDuo.leader} memeify={memeify} />
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{insights.strongestDuo.combinedPoints} combined pts</p>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Most Balanced</p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{getTeamDisplayName(insights.mostBalanced.team, memeify)}</p>
                  <InsightDriver driver={insights.mostBalanced.leader} memeify={memeify} />
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{insights.mostBalanced.leaderSharePct}-{insights.mostBalanced.teammateSharePct} split</p>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {visiblePairings.map((pairing) => {
              const teamColor = teamColors[pairing.team] ?? "#334155";
              const leaderName = getDriverDisplayName(pairing.leader.name, memeify);
              const teammateName = getDriverDisplayName(pairing.teammate.name, memeify);
              const leaderImage = getDriverImage(pairing.leader.name, pairing.leader.image, memeify);
              const teammateImage = getDriverImage(pairing.teammate.name, pairing.teammate.image, memeify);
              const teamLogo = getTeamImage(pairing.team, teamLogoImages[pairing.team] ?? "", memeify);
              const displayTeam = getTeamDisplayName(pairing.team, memeify);
              const dominanceHeadline = pairing.pointsGap <= 5 ? "Tight battle" : `${leaderName} dominant`;

              return (
                <article
                  key={pairing.team}
                  className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${teamColor}14 0%, transparent 55%)`,
                  }}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {teamLogo ? (
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${teamColor}2B` }}
                        >
                          <img
                            src={teamLogo}
                            alt={`${displayTeam} logo`}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="size-2 rounded-full" style={{ backgroundColor: teamColor }} />
                      )}
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{displayTeam}</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{pairing.pointsGap} pts gap</span>
                  </div>

                  <p className="mb-2 text-center text-lg font-bold" style={{ color: teamColor }}>
                    {dominanceHeadline}
                  </p>

                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <div className="min-w-0 flex flex-1 items-center gap-2">
                      <img
                        src={leaderImage}
                        alt={`${leaderName} portrait`}
                        className="h-6 w-6 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                        style={{ objectPosition: "center 0%" }}
                      />
                      <p className="min-w-0 truncate font-semibold">{leaderName} ({pairing.leader.points})</p>
                    </div>
                    <div className="min-w-0 flex flex-1 items-center justify-end gap-2">
                      <p className="min-w-0 truncate text-right font-semibold">{teammateName} ({pairing.teammate.points})</p>
                      <img
                        src={teammateImage}
                        alt={`${teammateName} portrait`}
                        className="h-6 w-6 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                        style={{ objectPosition: "center 0%" }}
                      />
                    </div>
                  </div>

                  <div className="mb-2 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex h-2.5 w-full">
                      <div style={{ width: `${pairing.leaderSharePct}%`, backgroundColor: teamColor }} />
                      <div style={{ width: `${pairing.teammateSharePct}%` }} className="bg-slate-400/50 dark:bg-slate-500/60" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span>Wins {pairing.leader.wins}-{pairing.teammate.wins}</span>
                    <span>Podiums {pairing.leader.podiums}-{pairing.teammate.podiums}</span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{pairing.combinedPoints} team pts</span>
                    <span>{pairing.combinedWins} wins | {pairing.combinedPodiums} podiums</span>
                    <span>{pairing.leaderSharePct}% lead share</span>
                  </div>
                </article>
              );
            })}
            </div>

            {pairings.length > 4 ? (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {showAll ? "Show less" : `Show all (${pairings.length})`}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
