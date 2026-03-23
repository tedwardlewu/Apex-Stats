import { useEffect, useState } from "react";
import { Activity, Flag, Shield, Sparkles, Trophy } from "lucide-react";
import * as api from "../services/api";
import { raceBestLapTimes, raceCatalog } from "../data/raceLapTimes";
import { upcomingRaceBySeason } from "../data/upcomingRaceData";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverImage, getDriverImageStyle } from "../utils/driverImages";

interface DriverStats {
  id: number;
  name: string;
  number: number;
  team: string;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
  image: string;
}

interface TeamStats {
  id: number;
  name: string;
  color: string;
  points: number;
}

interface PredictionRow extends DriverStats {
  probability: number;
  score: number;
  teamColor: string;
  reasons: string[];
}

const PREDICTION_WEIGHTS = {
  qualifying: 0.3,
  racePace: 0.3,
  teamPerformance: 0.2,
  trackHistory: 0.1,
  consistency: 0.1,
} as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalise(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0;
  }

  return value / maxValue;
}

function normaliseRange(value: number, minValue: number, maxValue: number) {
  const range = maxValue - minValue;

  if (range <= 0) {
    return 0.5;
  }

  return clamp((value - minValue) / range);
}

function buildRecentPaceScores(season: string) {
  const latestRace = [...raceCatalog]
    .filter((race) => race.season === season)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0];

  if (!latestRace) {
    return { latestRace: null, paceByDriver: new Map<string, number>() };
  }

  const lapTimes = raceBestLapTimes[latestRace.id] ?? [];

  if (lapTimes.length === 0) {
    return { latestRace, paceByDriver: new Map<string, number>() };
  }

  const quickestLap = Math.min(...lapTimes.map((entry) => entry.bestLap));
  const slowestLap = Math.max(...lapTimes.map((entry) => entry.bestLap));
  const lapRange = slowestLap - quickestLap;
  const paceByDriver = new Map<string, number>();

  lapTimes.forEach((entry) => {
    const paceScore = lapRange === 0 ? 1 : (slowestLap - entry.bestLap) / lapRange;
    paceByDriver.set(entry.driverName, clamp(paceScore));
  });

  return { latestRace, paceByDriver };
}

function buildReasons(values: {
  qualifyingScore: number;
  racePaceScore: number;
  teamPerformanceScore: number;
  trackHistoryScore: number;
  consistencyScore: number;
  paceScore: number;
}) {
  const reasonPool = [
    { label: "qualifying edge", value: values.qualifyingScore },
    { label: "race pace", value: values.racePaceScore },
    { label: "team performance", value: values.teamPerformanceScore },
    { label: "track history", value: values.trackHistoryScore },
    { label: "consistency", value: values.consistencyScore },
  ];

  return reasonPool
    .sort((left, right) => right.value - left.value)
    .slice(0, 3)
    .filter((reason) => reason.value > 0.2)
    .map((reason) => reason.label);
}

function buildPredictions(drivers: DriverStats[], teams: TeamStats[], season: string) {
  const upcomingRace = upcomingRaceBySeason[season];

  if (!upcomingRace || drivers.length === 0) {
    return { rows: [], upcomingRace, latestRace: null };
  }

  const maxPoints = Math.max(...drivers.map((driver) => driver.points), 0);
  const maxTeamPoints = Math.max(...teams.map((team) => team.points), 0);
  const maxQualifyingProxy = Math.max(...drivers.map((driver) => driver.wins * 2 + driver.podiums), 0);
  const teamPointMap = new Map(teams.map((team) => [team.name, team.points]));
  const teamColorMap = new Map(teams.map((team) => [team.name, team.color]));
  const { latestRace, paceByDriver } = buildRecentPaceScores(season);
  const trackBiasValues = Object.values(upcomingRace.teamBiases);
  const minTrackBias = Math.min(...trackBiasValues, 1);
  const maxTrackBias = Math.max(...trackBiasValues, 1);

  const scoredDrivers = drivers.map((driver) => {
    const qualifyingProxy = driver.wins * 2 + driver.podiums;
    const qualifyingScore = normalise(qualifyingProxy, maxQualifyingProxy);
    const racePaceScore = paceByDriver.get(driver.name) ?? normalise(driver.points, maxPoints);
    const teamPerformanceScore = normalise(teamPointMap.get(driver.team) ?? 0, maxTeamPoints);
    const trackBias = upcomingRace.teamBiases[driver.team] ?? 1;
    const trackHistoryScore = normaliseRange(trackBias, minTrackBias, maxTrackBias);
    const consistencyScore = clamp(
      normalise(driver.points, maxPoints) * 0.4 +
      (driver.podiums / Math.max(driver.wins + driver.podiums + 4, 1)) * 0.6,
    );

    const baseScore =
      qualifyingScore * PREDICTION_WEIGHTS.qualifying +
      racePaceScore * PREDICTION_WEIGHTS.racePace +
      teamPerformanceScore * PREDICTION_WEIGHTS.teamPerformance +
      trackHistoryScore * PREDICTION_WEIGHTS.trackHistory +
      consistencyScore * PREDICTION_WEIGHTS.consistency;

    return {
      driver,
      score: baseScore,
      teamColor: teamColorMap.get(driver.team) ?? "#475569",
      reasons: buildReasons({
        qualifyingScore,
        racePaceScore,
        teamPerformanceScore,
        trackHistoryScore,
        consistencyScore,
        paceScore: racePaceScore,
      }),
    };
  });

  const denominator = scoredDrivers.reduce((total, entry) => total + Math.exp(entry.score * 4), 0);
  const rows = scoredDrivers
    .map((entry) => ({
      ...entry.driver,
      score: entry.score,
      teamColor: entry.teamColor,
      reasons: entry.reasons,
      probability: denominator === 0 ? 0 : (Math.exp(entry.score * 4) / denominator) * 100,
    }))
    .sort((left, right) => right.probability - left.probability);

  return { rows, upcomingRace, latestRace };
}

function formatRaceDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SummaryCard({ icon: Icon, label, value, accent }: { icon: typeof Trophy; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function NextRacePrediction() {
  const { selectedSeason, selectedTeam, searchQuery } = useFilters();
  const { memeify } = useMemeify();
  const [drivers, setDrivers] = useState<DriverStats[]>([]);
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPredictionData() {
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
          setDrivers(driverResponse.data);
        }

        if (teamResponse.success) {
          setTeams(teamResponse.data);
        }
      } catch (error) {
        console.error("Error fetching prediction data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPredictionData();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedSeason, selectedTeam]);

  const { rows, upcomingRace, latestRace } = buildPredictions(drivers, teams, selectedSeason);
  const favorite = rows[0];
  const challenger = rows[1];
  const sleeper = [...rows]
    .sort((left, right) => (right.score - right.probability / 100) - (left.score - left.probability / 100))[0];

  if (!upcomingRace) {
    return (
      <section className="rounded-[28px] border border-slate-200/70 bg-white/85 p-8 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Predictions</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Next race outlook unavailable</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          There is no upcoming race context configured for the selected season yet. Add an entry in the upcoming race dataset to enable the predictor.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Predictions</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Next race win probability</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              A weighted score model for the {upcomingRace.name}. It blends qualifying, race pace, team performance, track history, and consistency.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200/70 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{upcomingRace.name}</p>
            <p>{upcomingRace.circuit}</p>
            <p>{upcomingRace.country} · {formatRaceDate(upcomingRace.date)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SummaryCard
          icon={Trophy}
          label="Favorite"
          value={favorite ? `${favorite.name} · ${favorite.probability.toFixed(1)}%` : "No prediction"}
          accent="bg-amber-100 text-amber-700"
        />
        <SummaryCard
          icon={Shield}
          label="Closest Challenger"
          value={challenger ? `${challenger.name} · ${challenger.probability.toFixed(1)}%` : "No challenger"}
          accent="bg-blue-100 text-blue-700"
        />
        <SummaryCard
          icon={Sparkles}
          label="Best Sleeper Pick"
          value={sleeper ? `${sleeper.name} · ${sleeper.probability.toFixed(1)}%` : "No sleeper"}
          accent="bg-emerald-100 text-emerald-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-slate-700/70">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Projected race leaderboard</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {selectedTeam !== "all" || searchQuery
                  ? "Percentages are normalized across the currently visible drivers, based on your filters."
                  : "Percentages are normalized across the full visible grid for this season snapshot."}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Activity className="size-4" />
              Weighted form model
            </div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-[22px] bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
              No drivers match the current filters.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {rows.map((row, index) => (
                <div key={row.id} className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-700/70 dark:bg-slate-900/60">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                        {index + 1}
                      </div>
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700"
                        style={{ backgroundColor: row.teamColor }}
                      >
                        <img
                          src={getDriverImage(row.name, row.image, memeify)}
                          alt={row.name}
                          className="h-14 w-14 rounded-full object-cover object-[center_-10%]"
                          style={getDriverImageStyle(row.name, memeify)}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white dark:bg-slate-100 dark:text-slate-900">#{row.number}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{row.team}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          {row.reasons.join(" · ") || "balanced profile"}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-[22rem]">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Win probability</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{row.probability.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${row.probability}%`, backgroundColor: row.teamColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <div className="space-y-6">
          <article className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <Flag className="size-5 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Circuit read</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{upcomingRace.summary}</p>
            <p className="mt-4 rounded-[20px] bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-900 dark:text-slate-300">{upcomingRace.modelFocus}</p>
            {latestRace && (
              <div className="mt-4 rounded-[20px] border border-slate-200/70 bg-white p-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Latest data feed</p>
                <p className="mt-2">Using lap pace and result signals from the {latestRace.name}.</p>
              </div>
            )}
          </article>

          <article className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Model inputs</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                <span>Qualifying</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">30%</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                <span>Race pace</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">30%</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                <span>Team performance</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">20%</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                <span>Track history</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">10%</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                <span>Consistency</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">10%</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}