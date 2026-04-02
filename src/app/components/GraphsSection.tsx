import { ReactNode, useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { ChartData, ChartOptions, Plugin } from "chart.js";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import * as api from "../services/api";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";

interface DriverStats {
  id: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
  debutSeason: number;
  image?: string;
}

interface TeamStats {
  id: number;
  name: string;
  color: string;
  points: number;
  wins: number;
  podiums: number;
}

interface Race {
  id: number;
  name: string;
  country: string;
  date: string;
}

interface DriverBestLap {
  driverName: string;
  bestLap: number;
}

interface RaceResultEntry {
  positionLabel: string;
  driverName: string;
  points: number;
}

interface TeammateAdjustedPaceRow {
  driverName: string;
  team: string;
  racesCompared: number;
  averageDeltaSeconds: number;
  tapRaw: number;
  tapShrunk: number;
}

interface PureDriverIndexRow {
  driverName: string;
  team: string;
  racesCompared: number;
  experienceSeasons: number;
  expectedTap: number;
  pureDriverIndex: number;
}

interface DriverRaceProgressionPoint {
  raceId: number;
  raceName: string;
  country: string;
  position: number | null;
  positionLabel: string;
  pointsGained: number;
}

const teamAliases: Record<string, string[]> = {
  RB: ["RB", "Racing Bulls"],
  Haas: ["Haas", "Haas F1 Team"],
  "Kick Sauber": ["Kick Sauber", "Audi", "Sauber"],
};

const TEAM_LOGO_PATHS: Record<string, string> = {
  alpine: "/Team Images/Alpine.avif",
  "aston martin": "/Team Images/Aston.avif",
  aston: "/Team Images/Aston.avif",
  audi: "/Team Images/Audi.avif",
  cadillac: "/Team Images/Cadillac.avif",
  ferrari: "/Team Images/Ferrari.avif",
  haas: "/Team Images/Haas.avif",
  "haas f1 team": "/Team Images/Haas.avif",
  mclaren: "/Team Images/McLaren.avif",
  mercedes: "/Team Images/Mercedes.avif",
  rb: "/Team Images/Racingbulls.avif",
  "racing bulls": "/Team Images/Racingbulls.avif",
  "red bull": "/Team Images/Redbull.avif",
  "red bull racing": "/Team Images/Redbull.avif",
  "oracle red bull racing": "/Team Images/Redbull.avif",
  redbull: "/Team Images/Redbull.avif",
  sauber: "/Team Images/Sauber.avif",
  "kick sauber": "/Team Images/Sauber.avif",
  williams: "/Team Images/Williams.avif",
};

const HAAS_BAR_COLOR = "#6b7280";

const COUNTRY_FLAG_PATHS: Record<string, string> = {
  Australia: "/Countries/Australia.webp",
  China: "/Countries/China.png",
  Japan: "/Countries/Japan.png",
  Bahrain: "/Countries/Bahrain.webp",
  "Saudi Arabia": "/Countries/Saudi Arabia.png",
  USA: "/Countries/USA.png",
  "United States": "/Countries/USA.png",
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
  Italy: "/Countries/Italy.webp",
};

const logoImageCache = new Map<string, HTMLImageElement>();

function normalizeTeamName(teamName: string) {
  return teamName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveTeamLogo(teamName: string) {
  const normalizedName = normalizeTeamName(teamName);

  if (TEAM_LOGO_PATHS[normalizedName]) {
    return TEAM_LOGO_PATHS[normalizedName];
  }

  if (normalizedName.includes("red bull")) {
    return "/Team Images/Redbull.avif";
  }

  if (normalizedName.includes("racing bulls") || normalizedName === "rb") {
    return "/Team Images/Racingbulls.avif";
  }

  return null;
}

function getLogoImage(path: string, redraw: () => void) {
  const cached = logoImageCache.get(path);

  if (cached) {
    return cached;
  }

  const image = new Image();
  image.src = path;
  image.onload = redraw;
  logoImageCache.set(path, image);

  return image;
}

function createTeamLogoPlugin(resolveTeamName: (label: string) => string | undefined): Plugin<"bar"> {
  return {
    id: "teamLogos",
    afterDatasetsDraw(chart) {
      const labels = chart.data.labels;

      if (!labels || labels.length === 0) {
        return;
      }

      const { ctx, chartArea, options } = chart;
      const isHorizontal = options.indexAxis === "y";
      const datasetMeta = chart.getDatasetMeta(0);

      if (!datasetMeta?.data?.length) {
        return;
      }

      labels.forEach((labelValue, index) => {
        const label = String(labelValue ?? "");
        const teamName = resolveTeamName(label);

        if (!teamName) {
          return;
        }

        const logoPath = resolveTeamLogo(teamName);

        if (!logoPath) {
          return;
        }

        const barElement = datasetMeta.data[index];

        if (!barElement) {
          return;
        }

        const logo = getLogoImage(logoPath, () => chart.draw());

        if (!logo.complete || logo.naturalWidth === 0) {
          return;
        }

        const { x, y, base } = barElement.getProps(["x", "y", "base"], true);
        const logoSize = 16;
        let drawX = 0;
        let drawY = 0;

        if (isHorizontal) {
          const barStart = Math.min(base, x);
          const barEnd = Math.max(base, x);
          const barWidth = barEnd - barStart;

          drawX = barWidth > logoSize + 10 ? barStart + 5 : barEnd + 5;
          drawY = y - logoSize / 2;
        } else {
          const barTop = Math.min(base, y);
          const barBottom = Math.max(base, y);
          const barHeight = barBottom - barTop;

          drawX = x - logoSize / 2;
          drawY = barHeight > logoSize + 6 ? barTop + 4 : barTop - logoSize - 2;
        }

        drawX = Math.max(chartArea.left + 2, Math.min(drawX, chartArea.right - logoSize - 2));
        drawY = Math.max(chartArea.top + 2, Math.min(drawY, chartArea.bottom - logoSize - 2));

        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX + logoSize / 2, drawY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, drawX, drawY, logoSize, logoSize);
        ctx.restore();
      });
    },
  };
}

function createBaseBarOptions(isDarkMode: boolean): ChartOptions<"bar"> {
  const labelColor = isDarkMode ? "#cbd5e1" : "#475569";
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";
  const gridColor = isDarkMode ? "rgba(148, 163, 184, 0.25)" : "rgba(148, 163, 184, 0.18)";

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: tickColor,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: tickColor,
          precision: 0,
        },
      },
    },
  };
}

function createHorizontalBarOptions(baseBarOptions: ChartOptions<"bar">): ChartOptions<"bar"> {
  return {
    ...baseBarOptions,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}

function createPointsHorizontalBarOptions(baseBarOptions: ChartOptions<"bar">): ChartOptions<"bar"> {
  return {
    ...createHorizontalBarOptions(baseBarOptions),
    scales: {
      ...baseBarOptions.scales,
      x: {
        ...baseBarOptions.scales?.x,
        title: {
          display: true,
          text: "Points",
          color: typeof baseBarOptions.scales?.x === "object" && "ticks" in (baseBarOptions.scales?.x ?? {})
            ? ((baseBarOptions.scales?.x as NonNullable<ChartOptions<"bar">["scales"]>["x"])?.ticks as { color?: string } | undefined)?.color ?? "#64748b"
            : "#64748b",
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
    },
  };
}

function createGroupedBarOptions(baseBarOptions: ChartOptions<"bar">, isDarkMode: boolean): ChartOptions<"bar"> {
  const labelColor = isDarkMode ? "#cbd5e1" : "#475569";

  return {
    ...baseBarOptions,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: labelColor,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  };
}

function createDoughnutOptions(isDarkMode: boolean): ChartOptions<"doughnut"> {
  const labelColor = isDarkMode ? "#cbd5e1" : "#475569";

  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    rotation: 0,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: labelColor,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,
        },
      },
    },
  };
}

function resolveVisibleTeams(teams: TeamStats[], selectedTeam: string) {
  if (selectedTeam === "all") {
    return teams;
  }

  const aliases = teamAliases[selectedTeam] ?? [selectedTeam];
  const filteredTeams = teams.filter((team) => aliases.includes(team.name));
  return filteredTeams.length > 0 ? filteredTeams : teams;
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

function calculateTeammateAdjustedPace(
  drivers: DriverStats[],
  lapTimesByRace: DriverBestLap[][],
): TeammateAdjustedPaceRow[] {
  const driverToTeam = new Map(drivers.map((driver) => [driver.name, driver.team]));
  const accumulator = new Map<string, { team: string; deltas: number[]; zScores: number[] }>();

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
        const current = accumulator.get(driverEntry.driverName) ?? { team: teamName, deltas: [], zScores: [] };

        current.deltas.push(delta);
        current.zScores.push(zScore);
        accumulator.set(driverEntry.driverName, current);
      });
    });
  });

  return Array.from(accumulator.entries())
    .map(([driverName, values]) => {
      const racesCompared = values.zScores.length;
      const tapRaw = -100 * median(values.zScores);
      const shrinkFactor = racesCompared / (racesCompared + 4);
      const tapShrunk = tapRaw * shrinkFactor;

      return {
        driverName,
        team: values.team,
        racesCompared,
        averageDeltaSeconds: Number(median(values.deltas).toFixed(3)),
        tapRaw: Number(tapRaw.toFixed(1)),
        tapShrunk: Number(tapShrunk.toFixed(1)),
      };
    })
    .sort((a, b) => b.tapShrunk - a.tapShrunk);
}

function calculatePureDriverIndex(
  rows: TeammateAdjustedPaceRow[],
  drivers: DriverStats[],
  selectedSeason: string,
): PureDriverIndexRow[] {
  const currentSeason = Number(selectedSeason);
  const driverExperience = new Map(
    drivers.map((driver) => [
      driver.name,
      Math.max(1, currentSeason - Number(driver.debutSeason) + 1),
    ]),
  );

  return rows
    .map((row) => {
      const experienceSeasons = driverExperience.get(row.driverName);

      if (!experienceSeasons) {
        return null;
      }

      const expectedTap = getExpectedExperienceAdjustment(experienceSeasons);
      const shrinkFactor = row.racesCompared / (row.racesCompared + 4);
      const pureDriverIndex = (row.tapRaw - expectedTap) * shrinkFactor;

      return {
        driverName: row.driverName,
        team: row.team,
        racesCompared: row.racesCompared,
        experienceSeasons,
        expectedTap: Number(expectedTap.toFixed(1)),
        pureDriverIndex: Number(pureDriverIndex.toFixed(1)),
      };
    })
    .filter((row): row is PureDriverIndexRow => row !== null)
    .sort((a, b) => b.pureDriverIndex - a.pureDriverIndex);
}

function buildDriverPointsData(drivers: DriverStats[], teams: TeamStats[], limit = 22): ChartData<"bar"> {
  const leaderboard = [...drivers].sort((a, b) => b.points - a.points).slice(0, limit);
  const teamColorMap = new Map(teams.map((team) => [team.name, team.color]));

  function resolveDriverBarColor(teamName: string) {
    const normalizedTeam = normalizeTeamName(teamName);

    if (normalizedTeam === "haas" || normalizedTeam === "haas f1 team") {
      return HAAS_BAR_COLOR;
    }

    return teamColorMap.get(teamName) ?? "#dc2626";
  }

  return {
    labels: leaderboard.map((driver) => driver.name),
    datasets: [
      {
        label: "Points",
        data: leaderboard.map((driver) => driver.points),
        backgroundColor: leaderboard.map((driver) => resolveDriverBarColor(driver.team)),
        borderRadius: 12,
        maxBarThickness: 28,
      },
    ],
  };
}

function buildWinsAndPodiumsData(drivers: DriverStats[]): ChartData<"bar"> {
  const contenders = [...drivers].sort((a, b) => b.points - a.points).slice(0, 8);

  return {
    labels: contenders.map((driver) => driver.name),
    datasets: [
      {
        label: "Wins",
        data: contenders.map((driver) => driver.wins),
        backgroundColor: "#f59e0b",
        borderRadius: 10,
      },
      {
        label: "Podiums",
        data: contenders.map((driver) => driver.podiums),
        backgroundColor: "#2563eb",
        borderRadius: 10,
      },
    ],
  };
}

function buildTeamPointsShareData(teams: TeamStats[], isDarkMode: boolean): ChartData<"doughnut"> {
  const rankedTeams = [...teams].sort((a, b) => b.points - a.points);

  return {
    labels: rankedTeams.map((team) => team.name),
    datasets: [
      {
        label: "Team Points",
        data: rankedTeams.map((team) => team.points),
        backgroundColor: rankedTeams.map((team) => team.color),
        borderColor: isDarkMode ? "#0f172a" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };
}

function buildAverageDriverPointsData(drivers: DriverStats[], teams: TeamStats[]): ChartData<"bar"> {
  const groupedTeams = drivers.reduce<Record<string, { totalPoints: number; driverCount: number }>>((accumulator, driver) => {
    const current = accumulator[driver.team] ?? { totalPoints: 0, driverCount: 0 };

    accumulator[driver.team] = {
      totalPoints: current.totalPoints + driver.points,
      driverCount: current.driverCount + 1,
    };

    return accumulator;
  }, {});

  const teamAverages = Object.entries(groupedTeams)
    .map(([team, totals]) => ({
      team,
      averagePoints: Number((totals.totalPoints / totals.driverCount).toFixed(1)),
    }))
    .sort((a, b) => b.averagePoints - a.averagePoints);
  const teamColorMap = new Map(teams.map((team) => [team.name, team.color]));

  function resolveTeamBarColor(teamName: string) {
    const normalizedTeam = normalizeTeamName(teamName);

    if (normalizedTeam === "haas" || normalizedTeam === "haas f1 team") {
      return HAAS_BAR_COLOR;
    }

    return teamColorMap.get(teamName) ?? "#0f766e";
  }

  return {
    labels: teamAverages.map((team) => team.team),
    datasets: [
      {
        label: "Avg points per driver",
        data: teamAverages.map((team) => team.averagePoints),
        backgroundColor: teamAverages.map((team) => resolveTeamBarColor(team.team)),
        borderRadius: 12,
        maxBarThickness: 42,
      },
    ],
  };
}

function buildTeammateAdjustedPaceData(rows: TeammateAdjustedPaceRow[], limit = rows.length): ChartData<"bar"> {
  const visibleRows = rows.slice(0, limit);

  return {
    labels: visibleRows.map((row) => row.driverName),
    datasets: [
      {
        label: "TAP score",
        data: visibleRows.map((row) => row.tapShrunk),
        backgroundColor: visibleRows.map((row) => (row.tapShrunk >= 0 ? "#16a34a" : "#dc2626")),
        borderRadius: 12,
        maxBarThickness: 28,
      },
    ],
  };
}

function buildPureDriverIndexData(rows: PureDriverIndexRow[]): ChartData<"bar"> {
  return {
    labels: rows.map((row) => row.driverName),
    datasets: [
      {
        label: "Pure driver index",
        data: rows.map((row) => row.pureDriverIndex),
        backgroundColor: rows.map((row) => (row.pureDriverIndex >= 0 ? "#2563eb" : "#f97316")),
        borderRadius: 12,
        maxBarThickness: 28,
      },
    ],
  };
}

function resolveCountryFlag(countryLabel: string) {
  const normalizedLabel = countryLabel.trim();
  const exactMatch = COUNTRY_FLAG_PATHS[normalizedLabel];

  if (exactMatch) {
    return exactMatch;
  }

  const matchedKey = Object.keys(COUNTRY_FLAG_PATHS).find((key) => normalizedLabel.includes(key));
  return matchedKey ? COUNTRY_FLAG_PATHS[matchedKey] : null;
}

function getRaceAxisLabel(raceName: string) {
  return raceName
    .replace("Grand Prix", "GP")
    .replace("Barcelona-Catalunya", "Barcelona")
    .replace("Emilia Romagna", "Imola")
    .trim();
}

function buildDriverRaceProgressions(races: Race[], raceResultsByRace: RaceResultEntry[][]) {
  const progressionByDriver = new Map<string, DriverRaceProgressionPoint[]>();

  races.forEach((race, raceIndex) => {
    const results = raceResultsByRace[raceIndex] ?? [];

    results.forEach((entry) => {
      const parsedPosition = Number.parseInt(entry.positionLabel, 10);
      const progression = progressionByDriver.get(entry.driverName) ?? [];

      progression.push({
        raceId: race.id,
        raceName: getRaceAxisLabel(race.name),
        country: race.country,
        position: Number.isFinite(parsedPosition) ? parsedPosition : null,
        positionLabel: entry.positionLabel,
        pointsGained: entry.points,
      });

      progressionByDriver.set(entry.driverName, progression);
    });
  });

  return progressionByDriver;
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-[10px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
      {message}
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
  contentHeightClassName = "h-72",
}: {
  title: string;
  description: string;
  children: ReactNode;
  contentHeightClassName?: string;
}) {
  return (
    <article className="rounded-[12px] border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <div className={`mt-5 ${contentHeightClassName}`}>{children}</div>
    </article>
  );
}

export function GraphsSection({
  showHeader = true,
  overviewMode = false,
  onViewDetailedAnalysis,
}: {
  showHeader?: boolean;
  overviewMode?: boolean;
  onViewDetailedAnalysis?: () => void;
}) {
  const { selectedSeason, selectedTeam, searchQuery } = useFilters();
  const { memeify } = useMemeify();
  const [drivers, setDrivers] = useState<DriverStats[]>([]);
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [teammateAdjustedPaceRows, setTeammateAdjustedPaceRows] = useState<TeammateAdjustedPaceRow[]>([]);
  const [pureDriverIndexRows, setPureDriverIndexRows] = useState<PureDriverIndexRow[]>([]);
  const [driverRaceProgressions, setDriverRaceProgressions] = useState<Map<string, DriverRaceProgressionPoint[]>>(new Map());
  const [selectedDriverName, setSelectedDriverName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchGraphData() {
      try {
        setLoading(true);

        const [driverResponse, teamResponse] = await Promise.all([
          api.getDrivers({ season: selectedSeason, team: selectedTeam, search: searchQuery }),
          api.getTeams({ season: selectedSeason }),
        ]);

        const [allDriversResponse, racesResponse] = await Promise.all([
          api.getDrivers({ season: selectedSeason }),
          api.getRaces({ season: selectedSeason }),
        ]);

        const raceLapResponses = racesResponse.success
          ? await Promise.all(racesResponse.data.map((race: Race) => api.getLapTimes({ season: selectedSeason, raceId: race.id })))
          : [];
        const raceResultResponses = racesResponse.success
          ? await Promise.all(racesResponse.data.map((race: Race) => api.getRaceResults({ season: selectedSeason, raceId: race.id })))
          : [];

        if (!isMounted) {
          return;
        }

        if (driverResponse.success) {
          setDrivers(driverResponse.data);
        }

        if (teamResponse.success) {
          setTeams(teamResponse.data);
        }

        if (allDriversResponse.success && racesResponse.success) {
          const lapTimesByRace = raceLapResponses
            .filter((response) => response.success)
            .map((response) => response.data as DriverBestLap[]);
          const teammateRows = calculateTeammateAdjustedPace(allDriversResponse.data, lapTimesByRace);
          const raceResultsByRace = raceResultResponses.map((response) =>
            response.success ? (response.data.results as RaceResultEntry[]) : [],
          );

          setTeammateAdjustedPaceRows(teammateRows);
          setPureDriverIndexRows(calculatePureDriverIndex(teammateRows, allDriversResponse.data, selectedSeason));
          setDriverRaceProgressions(buildDriverRaceProgressions(racesResponse.data as Race[], raceResultsByRace));
        } else {
          setTeammateAdjustedPaceRows([]);
          setPureDriverIndexRows([]);
          setDriverRaceProgressions(new Map());
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGraphData();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedSeason, selectedTeam]);

  const visibleTeams = resolveVisibleTeams(teams, selectedTeam);
  const driverPointsData = buildDriverPointsData(drivers, teams);
  const driverPointsOverviewData = buildDriverPointsData(drivers, teams, 10);
  const winsAndPodiumsData = buildWinsAndPodiumsData(drivers);
  const teamPointsShareData = buildTeamPointsShareData(visibleTeams, isDarkMode);
  const averageDriverPointsData = buildAverageDriverPointsData(drivers, teams);
  const constructorShareSummary = useMemo(() => {
    const sortedTeams = [...visibleTeams].sort((left, right) => right.points - left.points);
    const totalPoints = sortedTeams.reduce((sum, team) => sum + team.points, 0);
    const leader = sortedTeams[0] ?? null;
    const runnerUp = sortedTeams[1] ?? null;

    return {
      totalPoints,
      leader,
      runnerUp,
      allTeams: sortedTeams.map((team) => ({
        ...team,
        share: totalPoints > 0 ? (team.points / totalPoints) * 100 : 0,
      })),
    };
  }, [visibleTeams]);
  const filteredTeammateAdjustedRows = useMemo(() => {
    const searchTerm = searchQuery.trim().toLowerCase();

    return teammateAdjustedPaceRows.filter((row) => {
      const teamMatches = selectedTeam === "all"
        ? true
        : (teamAliases[selectedTeam] ?? [selectedTeam]).includes(row.team);
      const searchMatches = searchTerm ? row.driverName.toLowerCase().includes(searchTerm) : true;

      return teamMatches && searchMatches;
    });
  }, [searchQuery, selectedTeam, teammateAdjustedPaceRows]);
  const filteredPureDriverIndexRows = useMemo(() => {
    const searchTerm = searchQuery.trim().toLowerCase();

    return pureDriverIndexRows.filter((row) => {
      const teamMatches = selectedTeam === "all"
        ? true
        : (teamAliases[selectedTeam] ?? [selectedTeam]).includes(row.team);
      const searchMatches = searchTerm ? row.driverName.toLowerCase().includes(searchTerm) : true;

      return teamMatches && searchMatches;
    });
  }, [pureDriverIndexRows, searchQuery, selectedTeam]);
  const teammateAdjustedPaceData = buildTeammateAdjustedPaceData(filteredTeammateAdjustedRows);
  const teammateAdjustedPaceOverviewData = buildTeammateAdjustedPaceData(filteredTeammateAdjustedRows, 10);
  const pureDriverIndexData = buildPureDriverIndexData(filteredPureDriverIndexRows);
  const driverTeamMap = useMemo(() => new Map(drivers.map((driver) => [driver.name, driver.team])), [drivers]);
  const teammatePaceDriverTeamMap = useMemo(
    () => new Map(filteredTeammateAdjustedRows.map((row) => [row.driverName, row.team])),
    [filteredTeammateAdjustedRows],
  );
  const pureDriverTeamMap = useMemo(
    () => new Map(filteredPureDriverIndexRows.map((row) => [row.driverName, row.team])),
    [filteredPureDriverIndexRows],
  );
  const baseBarOptions = useMemo(() => createBaseBarOptions(isDarkMode), [isDarkMode]);
  const horizontalBarOptions = useMemo(() => createHorizontalBarOptions(baseBarOptions), [baseBarOptions]);
  const pointsHorizontalBarOptions = useMemo(() => createPointsHorizontalBarOptions(baseBarOptions), [baseBarOptions]);
  const groupedBarOptions = useMemo(
    () => createGroupedBarOptions(baseBarOptions, isDarkMode),
    [baseBarOptions, isDarkMode],
  );
  const doughnutOptions = useMemo(() => createDoughnutOptions(isDarkMode), [isDarkMode]);
  const analyticsDoughnutOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      ...doughnutOptions,
      cutout: "56%",
      radius: "96%",
      plugins: {
        ...doughnutOptions.plugins,
        legend: {
          ...doughnutOptions.plugins?.legend,
          display: false,
        },
      },
      layout: {
        padding: 0,
      },
    }),
    [doughnutOptions],
  );
  const driverLogoPlugin = useMemo(
    () => createTeamLogoPlugin((label) => driverTeamMap.get(label)),
    [driverTeamMap],
  );
  const teamLogoPlugin = useMemo(
    () => createTeamLogoPlugin((label) => label),
    [],
  );
  const teammateLogoPlugin = useMemo(
    () => createTeamLogoPlugin((label) => teammatePaceDriverTeamMap.get(label)),
    [teammatePaceDriverTeamMap],
  );
  const selectableDrivers = useMemo(
    () => [...drivers].sort((left, right) => right.points - left.points || left.name.localeCompare(right.name)),
    [drivers],
  );
  const selectedDriverProgression = useMemo(
    () => driverRaceProgressions.get(selectedDriverName) ?? [],
    [driverRaceProgressions, selectedDriverName],
  );
  const selectedDriverTeamColor = useMemo(() => {
    const selectedDriver = drivers.find((driver) => driver.name === selectedDriverName);
    if (!selectedDriver) {
      return "#2563eb";
    }

    return teams.find((team) => team.name === selectedDriver.team)?.color ?? "#2563eb";
  }, [drivers, selectedDriverName, teams]);
  const selectedDriver = useMemo(
    () => drivers.find((driver) => driver.name === selectedDriverName) ?? null,
    [drivers, selectedDriverName],
  );
  const leaderboardChartData = overviewMode ? driverPointsOverviewData : driverPointsData;
  const teammateAdjustedChartData = overviewMode ? teammateAdjustedPaceOverviewData : teammateAdjustedPaceData;
  const progressionCard = (
    <ChartCard
      title="Driver Race Progression"
      description="Race-by-race finishing position, with each point label showing the points gained at that round."
      contentHeightClassName={overviewMode ? "h-[33rem]" : "h-[29rem]"}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            {selectedDriver?.image ? (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={getDriverImage(selectedDriver.name, selectedDriver.image, memeify)}
                  alt={getDriverDisplayName(selectedDriver.name, memeify)}
                  className="h-full w-full object-cover object-[center_-12%]"
                  style={getDriverImageStyle(selectedDriver.name, memeify)}
                />
              </div>
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Driver view</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedDriver ? getDriverDisplayName(selectedDriver.name, memeify) : "Select a driver"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Round-by-round result trace with points gained labels.</p>
            </div>
          </div>
          <select
            value={selectedDriverName}
            onChange={(event) => setSelectedDriverName(event.target.value)}
            className="min-w-[13rem] rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {selectableDrivers.map((driver) => (
              <option key={driver.id} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1">
          {selectedDriverProgression.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedDriverProgression} margin={{ top: 20, right: 18, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.18)"} />
                <XAxis
                  dataKey="raceName"
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  height={52}
                  tick={({ x, y, payload }) => {
                    const point = payload?.payload as DriverRaceProgressionPoint | undefined;
                    const raceName = point?.raceName ?? String(payload?.value ?? "");
                    const flagPath = point?.country ? resolveCountryFlag(point.country) : null;

                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={10}
                          textAnchor="middle"
                          fill={isDarkMode ? "#cbd5e1" : "#475569"}
                          fontSize="11"
                          fontWeight={700}
                        >
                          {raceName}
                        </text>
                        {flagPath ? (
                          <foreignObject x={-12} y={18} width={24} height={18}>
                            <img
                              src={flagPath}
                              alt={`${point?.country ?? raceName} flag`}
                              className="h-[15px] w-[24px] rounded-[3px] object-cover shadow-sm"
                            />
                          </foreignObject>
                        ) : null}
                      </g>
                    );
                  }}
                />
                <YAxis
              domain={[20, 1]}
              reversed
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDarkMode ? "#cbd5e1" : "#475569", fontSize: 12 }}
              label={{
                value: "Position",
                angle: -90,
                position: "insideLeft",
                fill: isDarkMode ? "#cbd5e1" : "#334155",
                fontSize: 12,
                fontWeight: 700,
              }}
              ticks={Array.from({ length: 20 }, (_, index) => index + 1)}
                />
                <RechartsTooltip
              contentStyle={{
                background: isDarkMode ? "#0f172a" : "#ffffff",
                border: `1px solid ${isDarkMode ? "#334155" : "#cbd5e1"}`,
                borderRadius: 12,
              }}
              formatter={(value: number, name: string) => {
                if (name === "pointsGained") {
                  return [`${value} pts`, "Points gained"];
                }

                if (name === "position") {
                  return [value ? `P${value}` : "DNF", "Position"];
                }

                return [value, name];
              }}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload as DriverRaceProgressionPoint | undefined;
                return point ? `${point.raceName} · ${point.country}` : "";
              }}
                />
                <Line
              type="linear"
              dataKey="position"
              stroke={selectedDriverTeamColor}
              strokeWidth={3}
              connectNulls={false}
              dot={{ r: overviewMode ? 5 : 4.5, fill: selectedDriverTeamColor, stroke: isDarkMode ? "#0f172a" : "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              isAnimationActive
                >
                  <LabelList
                dataKey="pointsGained"
                position="top"
                formatter={(value: number) => `${value} pts`}
                fill={isDarkMode ? "#e2e8f0" : "#334155"}
                fontSize={11}
                fontWeight={700}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No race progression data is available for the selected driver." />
          )}
        </div>
      </div>
    </ChartCard>
  );
  const leaderboardCard = (
    <ChartCard
      title="Driver Points Leaderboard"
      description={overviewMode ? "Top scorers snapshot for the current view." : "Full scoring order for the current season and active filters."}
      contentHeightClassName={overviewMode ? "h-[18rem]" : "h-[30rem]"}
    >
      {leaderboardChartData.labels && leaderboardChartData.labels.length > 0 ? (
        <Bar data={leaderboardChartData} options={pointsHorizontalBarOptions} plugins={[driverLogoPlugin]} />
      ) : (
        <EmptyChartState message="No drivers match the current filters." />
      )}
    </ChartCard>
  );
  const teammateAdjustedPaceCard = (
    <ChartCard
      title="Teammate-Adjusted Pace"
      description="Per-race lap delta versus teammate, normalized by race pace spread and shrunk for low sample sizes."
      contentHeightClassName={overviewMode ? "h-[18rem]" : "h-[30rem]"}
    >
      {teammateAdjustedChartData.labels && teammateAdjustedChartData.labels.length > 0 ? (
        <Bar data={teammateAdjustedChartData} options={horizontalBarOptions} plugins={[teammateLogoPlugin]} />
      ) : (
        <EmptyChartState message="Not enough teammate lap comparisons for the current filters." />
      )}
    </ChartCard>
  );
  const winsAndPodiumsCard = (
    <ChartCard
      title="Wins vs Podiums"
      description="How the leading drivers are converting pace into standout race results."
      contentHeightClassName={overviewMode ? "h-[16rem]" : "h-[18rem]"}
    >
      {winsAndPodiumsData.labels && winsAndPodiumsData.labels.length > 0 ? (
        <Bar data={winsAndPodiumsData} options={groupedBarOptions} plugins={[driverLogoPlugin]} />
      ) : (
        <EmptyChartState message="Adjust the filters to compare wins and podiums." />
      )}
    </ChartCard>
  );
  const constructorPointsShareCard = (
    <ChartCard
      title="Constructor Points Share"
      description="Distribution of points across the current constructor field."
      contentHeightClassName={overviewMode ? "h-[16rem]" : "h-[31rem]"}
    >
      {teamPointsShareData.labels && teamPointsShareData.labels.length > 0 ? (
        overviewMode ? (
          <Doughnut data={teamPointsShareData} options={doughnutOptions} />
        ) : (
          <div className="flex h-full min-h-0 flex-col">
            <div className="h-[11.03rem] shrink-0">
              <Doughnut data={teamPointsShareData} options={analyticsDoughnutOptions} />
            </div>
            <div className="mt-3 shrink-0 border-t border-slate-200/70 pt-3 dark:border-slate-700/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Constructors</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {constructorShareSummary.allTeams.map((team) => (
                  <div
                    key={`${team.id}-legend`}
                    className="flex min-w-0 items-center gap-2 rounded-[10px] border border-slate-200/70 px-2.5 py-2 dark:border-slate-700/70"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{team.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 rounded-[10px] border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-700/70 dark:bg-slate-950/40">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Leader share</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {constructorShareSummary.leader && constructorShareSummary.totalPoints > 0
                    ? `${((constructorShareSummary.leader.points / constructorShareSummary.totalPoints) * 100).toFixed(1)}%`
                    : "0.0%"}
                </p>
                {constructorShareSummary.leader ? (
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {resolveTeamLogo(constructorShareSummary.leader.name) ? (
                      <img
                        src={resolveTeamLogo(constructorShareSummary.leader.name) ?? undefined}
                        alt={constructorShareSummary.leader.name}
                        className="h-4 w-4 shrink-0 rounded-full object-cover"
                      />
                    ) : null}
                    <span className="truncate">{constructorShareSummary.leader.name}</span>
                  </div>
                ) : (
                  <p className="truncate text-xs text-slate-600 dark:text-slate-300">No team data</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Points gap</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {constructorShareSummary.leader && constructorShareSummary.runnerUp
                    ? `${constructorShareSummary.leader.points - constructorShareSummary.runnerUp.points} pts`
                    : "0 pts"}
                </p>
                {constructorShareSummary.runnerUp ? (
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="shrink-0">vs</span>
                    {resolveTeamLogo(constructorShareSummary.runnerUp.name) ? (
                      <img
                        src={resolveTeamLogo(constructorShareSummary.runnerUp.name) ?? undefined}
                        alt={constructorShareSummary.runnerUp.name}
                        className="h-4 w-4 shrink-0 rounded-full object-cover"
                      />
                    ) : null}
                    <span className="truncate">{constructorShareSummary.runnerUp.name}</span>
                  </div>
                ) : (
                  <p className="truncate text-xs text-slate-600 dark:text-slate-300">No runner-up available</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Total points</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{constructorShareSummary.totalPoints} pts</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">Across {constructorShareSummary.allTeams.length} teams</p>
              </div>
            </div>
          </div>
        )
      ) : (
        <EmptyChartState message="No constructor data is available for this view." />
      )}
    </ChartCard>
  );
  const averagePointsPerDriverCard = (
    <ChartCard
      title="Average Points Per Driver"
      description="Quick read on how productive each filtered team pairing is on average."
      contentHeightClassName={overviewMode ? "h-[18rem]" : "h-[20rem]"}
    >
      {averageDriverPointsData.labels && averageDriverPointsData.labels.length > 0 ? (
        <Bar data={averageDriverPointsData} options={baseBarOptions} plugins={[teamLogoPlugin]} />
      ) : (
        <EmptyChartState message="No driver averages can be calculated for the current filters." />
      )}
    </ChartCard>
  );

  useEffect(() => {
    if (selectableDrivers.length === 0) {
      setSelectedDriverName("");
      return;
    }

    if (!selectedDriverName || !selectableDrivers.some((driver) => driver.name === selectedDriverName)) {
      setSelectedDriverName(selectableDrivers[0].name);
    }
  }, [selectableDrivers, selectedDriverName]);

  return (
    <section className="space-y-6">
      {showHeader ? (
        <div className="rounded-[12px] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Graphs</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Season performance view</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
           Analytical graphs including: {selectedSeason} data{selectedTeam !== "all" ? ` for ${selectedTeam}` : " across the full grid"}{searchQuery ? ` with the search term \"${searchQuery}\" applied` : ""}.
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[23rem] animate-pulse rounded-[12px] border border-slate-200/70 bg-white/70 dark:border-slate-700/70 dark:bg-slate-900/70" />
          ))}
        </div>
      ) : overviewMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-[12px] border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Overview graphs</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Compact race and points analysis for the current filters.</p>
            </div>
            <button
              type="button"
              onClick={onViewDetailedAnalysis}
              className="rounded-[10px] border border-sky-300/90 bg-white px-3.5 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-[1px] hover:border-sky-400 hover:text-sky-800 hover:shadow dark:border-sky-800/80 dark:bg-slate-900 dark:text-sky-300 dark:hover:border-sky-700 dark:hover:text-sky-200"
            >
              View detailed analysis
            </button>
          </div>
          {progressionCard}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {leaderboardCard}
            {teammateAdjustedPaceCard}
            {winsAndPodiumsCard}
            {constructorPointsShareCard}
            <div className="xl:col-span-2">{averagePointsPerDriverCard}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {constructorPointsShareCard}
          {progressionCard}
          {leaderboardCard}
          {teammateAdjustedPaceCard}
          {winsAndPodiumsCard}
          {averagePointsPerDriverCard}
        </div>
      )}
    </section>
  );
}
