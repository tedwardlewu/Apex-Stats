import { ReactNode, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { ChartData, ChartOptions } from "chart.js";
import { useFilters } from "../contexts/FilterContext";
import * as api from "../services/api";

interface DriverStats {
  id: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
}

interface TeamStats {
  id: number;
  name: string;
  color: string;
  points: number;
  wins: number;
  podiums: number;
}

const teamAliases: Record<string, string[]> = {
  RB: ["RB", "Racing Bulls"],
  Haas: ["Haas", "Haas F1 Team"],
  "Kick Sauber": ["Kick Sauber", "Audi", "Sauber"],
};

const baseBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#475569",
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(148, 163, 184, 0.18)",
      },
      ticks: {
        color: "#64748b",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.18)",
      },
      ticks: {
        color: "#64748b",
        precision: 0,
      },
    },
  },
};

const horizontalBarOptions: ChartOptions<"bar"> = {
  ...baseBarOptions,
  indexAxis: "y",
  plugins: {
    legend: {
      display: false,
    },
  },
};

const groupedBarOptions: ChartOptions<"bar"> = {
  ...baseBarOptions,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#475569",
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
  },
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  rotation: 0,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#475569",
        usePointStyle: true,
        pointStyle: "circle",
        padding: 18,
      },
    },
  },
};

function resolveVisibleTeams(teams: TeamStats[], selectedTeam: string) {
  if (selectedTeam === "all") {
    return teams;
  }

  const aliases = teamAliases[selectedTeam] ?? [selectedTeam];
  const filteredTeams = teams.filter((team) => aliases.includes(team.name));
  return filteredTeams.length > 0 ? filteredTeams : teams;
}

function buildDriverPointsData(drivers: DriverStats[], teams: TeamStats[]): ChartData<"bar"> {
  const leaderboard = [...drivers].sort((a, b) => b.points - a.points).slice(0, 10);
  const teamColorMap = new Map(teams.map((team) => [team.name, team.color]));

  return {
    labels: leaderboard.map((driver) => driver.name),
    datasets: [
      {
        label: "Points",
        data: leaderboard.map((driver) => driver.points),
        backgroundColor: leaderboard.map((driver) => teamColorMap.get(driver.team) ?? "#dc2626"),
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

function buildTeamPointsShareData(teams: TeamStats[]): ChartData<"doughnut"> {
  const rankedTeams = [...teams].sort((a, b) => b.points - a.points);

  return {
    labels: rankedTeams.map((team) => team.name),
    datasets: [
      {
        label: "Team Points",
        data: rankedTeams.map((team) => team.points),
        backgroundColor: rankedTeams.map((team) => team.color),
        borderColor: "#ffffff",
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

  return {
    labels: teamAverages.map((team) => team.team),
    datasets: [
      {
        label: "Avg points per driver",
        data: teamAverages.map((team) => team.averagePoints),
        backgroundColor: teamAverages.map((team) => teamColorMap.get(team.team) ?? "#0f766e"),
        borderRadius: 12,
        maxBarThickness: 42,
      },
    ],
  };
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <article className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-6 h-72">{children}</div>
    </article>
  );
}

export function GraphsSection() {
  const { selectedSeason, selectedTeam, searchQuery } = useFilters();
  const [drivers, setDrivers] = useState<DriverStats[]>([]);
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchGraphData() {
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
  const winsAndPodiumsData = buildWinsAndPodiumsData(drivers);
  const teamPointsShareData = buildTeamPointsShareData(visibleTeams);
  const averageDriverPointsData = buildAverageDriverPointsData(drivers, teams);

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Graphs</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Season performance view</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
         Analytical graphs including: {selectedSeason} data{selectedTeam !== "all" ? ` for ${selectedTeam}` : " across the full grid"}{searchQuery ? ` with the search term \"${searchQuery}\" applied` : ""}.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[23rem] animate-pulse rounded-[28px] border border-slate-200/70 bg-white/70" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ChartCard
            title="Driver Points Leaderboard"
            description="Top scoring drivers for the current season and active filters."
          >
            {driverPointsData.labels && driverPointsData.labels.length > 0 ? (
              <Bar data={driverPointsData} options={horizontalBarOptions} />
            ) : (
              <EmptyChartState message="No drivers match the current filters." />
            )}
          </ChartCard>

          <ChartCard
            title="Wins vs Podiums"
            description="How the leading drivers are converting pace into standout race results."
          >
            {winsAndPodiumsData.labels && winsAndPodiumsData.labels.length > 0 ? (
              <Bar data={winsAndPodiumsData} options={groupedBarOptions} />
            ) : (
              <EmptyChartState message="Adjust the filters to compare wins and podiums." />
            )}
          </ChartCard>

          <ChartCard
            title="Constructor Points Share"
            description="Distribution of points across the current constructor field."
          >
            {teamPointsShareData.labels && teamPointsShareData.labels.length > 0 ? (
              <Doughnut data={teamPointsShareData} options={doughnutOptions} />
            ) : (
              <EmptyChartState message="No constructor data is available for this view." />
            )}
          </ChartCard>

          <ChartCard
            title="Average Points Per Driver"
            description="Quick read on how productive each filtered team pairing is on average."
          >
            {averageDriverPointsData.labels && averageDriverPointsData.labels.length > 0 ? (
              <Bar data={averageDriverPointsData} options={baseBarOptions} />
            ) : (
              <EmptyChartState message="No driver averages can be calculated for the current filters." />
            )}
          </ChartCard>
        </div>
      )}
    </section>
  );
}
