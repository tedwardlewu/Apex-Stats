import { useEffect, useState } from "react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";

interface Driver {
  id: number;
  name: string;
  number: number;
  team: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
  image: string;
  debutSeason?: number;
}

interface ConsistencyRow {
  driver: string;
  score: number;
  avgPosition: number;
}

interface Race {
  id: number;
}

interface RaceResultEntry {
  positionLabel: string;
  driverName: string;
  result: string;
}

interface DriverBestLap {
  driverName: string;
  bestLap: number;
}

interface TeammateAdjustedPaceRow {
  driverName: string;
  team: string;
  racesCompared: number;
  tapRaw: number;
}

interface ExpectationRow {
  driverName: string;
  pureDriverIndex: number;
}

interface AnalysisHighlight {
  label: string;
  value: string;
  subtext: string;
  driver?: Driver | null;
}

interface TeammateGapRow {
  trailingDriver: Driver;
  leadingDriver: Driver;
  pointsGap: number;
}

interface FinisherRow {
  driver: Driver;
  dnfs: number;
  finishes: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mean(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  }

  return sortedValues[middleIndex];
}

function stdDev(values: number[]) {
  if (values.length <= 1) {
    return 0;
  }

  const avg = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function getExpectedExperienceAdjustment(experienceSeasons: number) {
  if (experienceSeasons <= 1) {
    return -18;
  }

  if (experienceSeasons === 2) {
    return -10;
  }

  if (experienceSeasons === 3) {
    return -5;
  }

  if (experienceSeasons === 4) {
    return -2;
  }

  return 0;
}

function calculateTeammateAdjustedPace(drivers: Driver[], lapTimesByRace: DriverBestLap[][]): TeammateAdjustedPaceRow[] {
  const driverToTeam = new Map(drivers.map((driver) => [driver.name, driver.team]));
  const accumulator = new Map<string, { team: string; zScores: number[] }>();

  lapTimesByRace.forEach((raceLapTimes) => {
    const validLapTimes = raceLapTimes
      .filter((entry) => Number.isFinite(Number(entry.bestLap)) && driverToTeam.has(entry.driverName))
      .map((entry) => ({
        driverName: entry.driverName,
        bestLap: Number(entry.bestLap),
        team: driverToTeam.get(entry.driverName) as string,
      }));

    if (validLapTimes.length < 4) {
      return;
    }

    const spread = stdDev(validLapTimes.map((entry) => entry.bestLap));
    const normalizedSpread = spread > 0 ? spread : 0.25;
    const entriesByTeam = validLapTimes.reduce<Record<string, { driverName: string; bestLap: number }[]>>((acc, entry) => {
      const current = acc[entry.team] ?? [];
      current.push({ driverName: entry.driverName, bestLap: entry.bestLap });
      acc[entry.team] = current;
      return acc;
    }, {});

    Object.entries(entriesByTeam).forEach(([teamName, teamEntries]) => {
      if (teamEntries.length < 2) {
        return;
      }

      teamEntries.forEach((driverEntry) => {
        const teammateBest = Math.min(
          ...teamEntries
            .filter((entry) => entry.driverName !== driverEntry.driverName)
            .map((entry) => entry.bestLap),
        );

        if (!Number.isFinite(teammateBest)) {
          return;
        }

        const delta = driverEntry.bestLap - teammateBest;
        const zScore = clamp(delta / normalizedSpread, -2, 2);
        const current = accumulator.get(driverEntry.driverName) ?? { team: teamName, zScores: [] };

        current.zScores.push(zScore);
        accumulator.set(driverEntry.driverName, current);
      });
    });
  });

  return Array.from(accumulator.entries())
    .map(([driverName, values]) => ({
      driverName,
      team: values.team,
      racesCompared: values.zScores.length,
      tapRaw: Number((-100 * median(values.zScores)).toFixed(1)),
    }))
    .sort((a, b) => b.tapRaw - a.tapRaw);
}

function calculateExpectationRows(rows: TeammateAdjustedPaceRow[], drivers: Driver[], selectedSeason: string): ExpectationRow[] {
  const currentSeason = Number(selectedSeason);
  const driverExperience = new Map(
    drivers.map((driver) => [driver.name, Math.max(1, currentSeason - Number(driver.debutSeason ?? currentSeason) + 1)]),
  );

  return rows
    .map((row) => {
      const experienceSeasons = driverExperience.get(row.driverName);

      if (!experienceSeasons) {
        return null;
      }

      const expectedTap = getExpectedExperienceAdjustment(experienceSeasons);
      const shrinkFactor = row.racesCompared / (row.racesCompared + 4);

      return {
        driverName: row.driverName,
        pureDriverIndex: Number(((row.tapRaw - expectedTap) * shrinkFactor).toFixed(1)),
      };
    })
    .filter((row): row is ExpectationRow => row !== null)
    .sort((a, b) => b.pureDriverIndex - a.pureDriverIndex);
}

function findLargestTeammateGap(drivers: Driver[]): TeammateGapRow | null {
  const byTeam = new Map<string, Driver[]>();

  drivers.forEach((driver) => {
    const teamDrivers = byTeam.get(driver.team) ?? [];
    teamDrivers.push(driver);
    byTeam.set(driver.team, teamDrivers);
  });

  const gaps: TeammateGapRow[] = [];

  byTeam.forEach((teamDrivers) => {
    if (teamDrivers.length < 2) {
      return;
    }

    const [leadingDriver, trailingDriver] = [...teamDrivers].sort((a, b) => {
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

    gaps.push({
      trailingDriver,
      leadingDriver,
      pointsGap: leadingDriver.points - trailingDriver.points,
    });
  });

  return gaps.sort((a, b) => b.pointsGap - a.pointsGap)[0] ?? null;
}

function buildFinisherRows(drivers: Driver[], raceResultsByRace: RaceResultEntry[][]): FinisherRow[] {
  const summary = new Map<string, { dnfs: number; finishes: number }>();

  raceResultsByRace.forEach((results) => {
    results.forEach((entry) => {
      const current = summary.get(entry.driverName) ?? { dnfs: 0, finishes: 0 };
      const isFinish = /^\d+$/.test(entry.positionLabel);

      if (isFinish) {
        current.finishes += 1;
      } else if (entry.result !== "DNS") {
        current.dnfs += 1;
      }

      summary.set(entry.driverName, current);
    });
  });

  return drivers
    .map((driver) => {
      const row = summary.get(driver.name) ?? { dnfs: 0, finishes: 0 };
      return {
        driver,
        dnfs: row.dnfs,
        finishes: row.finishes,
      };
    })
    .sort((a, b) => a.dnfs - b.dnfs || b.finishes - a.finishes || b.driver.points - a.driver.points);
}

function HighlightCard({ label, value, subtext, driver }: AnalysisHighlight & { driver?: Driver | null }) {
  const { memeify } = useMemeify();
  const displayName = driver ? getDriverDisplayName(driver.name, memeify) : value;

  return (
    <div className="rounded-[12px] border border-slate-200/70 bg-slate-50/80 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/60">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
      {driver ? (
        <div className="mt-2 flex items-center gap-2.5">
          <img
            src={getDriverImage(driver.name, driver.image, memeify)}
            alt={displayName}
            className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover object-[center_-10%] dark:border-slate-700"
            style={getDriverImageStyle(driver.name, memeify)}
          />
          <p className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
        </div>
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      )}
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{subtext}</p>
    </div>
  );
}

export function DriverQualitiesGrid({
  title,
  description,
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const [analysisHighlights, setAnalysisHighlights] = useState<AnalysisHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, selectedTeam, selectedSeason } = useFilters();

  useEffect(() => {
    async function fetchHighlights() {
      setLoading(true);
      const [driversResponse, consistencyResponse, racesResponse] = await Promise.all([
        api.getDrivers({
          search: searchQuery,
          team: selectedTeam,
          season: selectedSeason,
        }),
        api.getConsistency({ season: selectedSeason }),
        api.getRaces({ season: selectedSeason }),
      ]);

      if (driversResponse.success) {
        const nextDrivers = driversResponse.data;
        const worstDriverGap = findLargestTeammateGap(nextDrivers);
        const visibleDriverNames = new Set(nextDrivers.map((driver) => driver.name));
        const visibleConsistency = consistencyResponse.success
          ? consistencyResponse.data.filter((row: ConsistencyRow) => visibleDriverNames.has(row.driver))
          : [];
        const mostConsistent = visibleConsistency[0] ?? null;
        const leastConsistent = visibleConsistency[visibleConsistency.length - 1] ?? null;

        let expectationRows: ExpectationRow[] = [];
        let finisherRows: FinisherRow[] = [];
        let teammateAdjustedRows: TeammateAdjustedPaceRow[] = [];

        if (racesResponse.success) {
          const [lapResponses, raceResultResponses] = await Promise.all([
            Promise.all(racesResponse.data.map((race: Race) => api.getLapTimes({ season: selectedSeason, raceId: race.id }))),
            Promise.all(racesResponse.data.map((race: Race) => api.getRaceResults({ season: selectedSeason, raceId: race.id }))),
          ]);

          const lapTimesByRace = lapResponses
            .filter((response) => response.success)
            .map((response) => response.data as DriverBestLap[]);
          const raceResultsByRace = raceResultResponses
            .filter((response) => response.success)
            .map((response) => response.data.results as RaceResultEntry[]);

          teammateAdjustedRows = calculateTeammateAdjustedPace(nextDrivers, lapTimesByRace);
          expectationRows = calculateExpectationRows(teammateAdjustedRows, nextDrivers, selectedSeason);
          finisherRows = buildFinisherRows(nextDrivers, raceResultsByRace);
        }

        const bestDriver = teammateAdjustedRows[0] ?? null;
        const mostExceeding = expectationRows[0] ?? null;
        const mostFailing = expectationRows[expectationRows.length - 1] ?? null;
        const mostReliableFinisher = finisherRows[0] ?? null;
        const leastReliableFinisher = [...finisherRows].sort((a, b) => b.dnfs - a.dnfs || a.finishes - b.finishes || a.driver.points - b.driver.points)[0] ?? null;

        setAnalysisHighlights([
          {
            label: "Best driver",
            value: bestDriver?.driverName ?? "Not enough data",
            subtext: bestDriver ? `${bestDriver.tapRaw > 0 ? "+" : ""}${bestDriver.tapRaw} teammate-adjusted pace` : "No teammate pace sample",
            driver: nextDrivers.find((driver) => driver.name === bestDriver?.driverName) ?? null,
          },
          {
            label: "Worst driver",
            value: worstDriverGap?.trailingDriver.name ?? "No data",
            subtext: worstDriverGap
              ? `${worstDriverGap.pointsGap} pts behind ${worstDriverGap.leadingDriver.name}`
              : "Need at least one full teammate pairing",
            driver: worstDriverGap?.trailingDriver ?? null,
          },
          {
            label: "Most consistent",
            value: mostConsistent?.driver ?? "Not enough data",
            subtext: mostConsistent ? `${mostConsistent.score} score · P${mostConsistent.avgPosition.toFixed(1)} avg` : "No valid race result sample",
            driver: nextDrivers.find((driver) => driver.name === mostConsistent?.driver) ?? null,
          },
          {
            label: "Least consistent",
            value: leastConsistent?.driver ?? "Not enough data",
            subtext: leastConsistent ? `${leastConsistent.score} score · P${leastConsistent.avgPosition.toFixed(1)} avg` : "No valid race result sample",
            driver: nextDrivers.find((driver) => driver.name === leastConsistent?.driver) ?? null,
          },
          {
            label: "Most exceeding",
            value: mostExceeding?.driverName ?? "Not enough data",
            subtext: mostExceeding ? `${mostExceeding.pureDriverIndex > 0 ? "+" : ""}${mostExceeding.pureDriverIndex} expectation delta` : "No teammate pace sample",
            driver: nextDrivers.find((driver) => driver.name === mostExceeding?.driverName) ?? null,
          },
          {
            label: "Most failing",
            value: mostFailing?.driverName ?? "Not enough data",
            subtext: mostFailing ? `${mostFailing.pureDriverIndex > 0 ? "+" : ""}${mostFailing.pureDriverIndex} expectation delta` : "No teammate pace sample",
            driver: nextDrivers.find((driver) => driver.name === mostFailing?.driverName) ?? null,
          },
          {
            label: "Most race finisher",
            value: mostReliableFinisher?.driver.name ?? "Not enough data",
            subtext: mostReliableFinisher ? `${mostReliableFinisher.finishes} finishes · ${mostReliableFinisher.dnfs} DNFs` : "No classified race sample",
            driver: mostReliableFinisher?.driver ?? null,
          },
          {
            label: "Least race finisher",
            value: leastReliableFinisher?.driver.name ?? "Not enough data",
            subtext: leastReliableFinisher ? `${leastReliableFinisher.dnfs} DNFs · ${leastReliableFinisher.finishes} finishes` : "No classified race sample",
            driver: leastReliableFinisher?.driver ?? null,
          },
        ]);
      }

      setLoading(false);
    }

    fetchHighlights();
  }, [searchQuery, selectedSeason, selectedTeam]);

  return (
    <div className={compact ? "rounded-[12px] border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80" : ""}>
      {title ? <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3> : null}
      {description ? <p className={`${title ? "mt-1" : ""} text-sm text-slate-600 dark:text-slate-300`}>{description}</p> : null}
      <div className={`${title || description ? "mt-4" : ""} grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4`}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[92px] animate-pulse rounded-[12px] border border-slate-200/70 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70" />
            ))
          : analysisHighlights.map((item) => <HighlightCard key={item.label} {...item} />)}
      </div>
    </div>
  );
}