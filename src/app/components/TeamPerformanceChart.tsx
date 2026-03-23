import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3 } from "lucide-react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";

interface TeamStat {
  name: string;
  color: string;
  points: number;
}

type TeamSeries = {
  name: string;
  color: string;
  key: string;
};

const teamAliases: Record<string, string[]> = {
  RB: ["RB", "Racing Bulls"],
  Haas: ["Haas", "Haas F1 Team"],
  Sauber: ["Sauber", "Kick Sauber", "Audi"],
  Audi: ["Audi", "Kick Sauber", "Sauber"],
  "Kick Sauber": ["Kick Sauber", "Audi", "Sauber"],
};

function keyFromTeamName(teamName: string) {
  return `team_${teamName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
}

function buildTeamSeries(
  teamsBySeason: Record<string, TeamStat[]>,
  selectedSeason: string,
  selectedTeam: string,
): TeamSeries[] {
  const seasons = Object.keys(teamsBySeason).sort((a, b) => Number(a) - Number(b));

  if (seasons.length === 0) {
    return [];
  }

  const pivotSeason = teamsBySeason[selectedSeason] ? selectedSeason : seasons[seasons.length - 1];
  const pivotTeams = teamsBySeason[pivotSeason] ?? [];

  const visibleTeamNames =
    selectedTeam === "all"
      ? [...pivotTeams]
          .sort((a, b) => b.points - a.points)
          .slice(0, 5)
          .map((team) => team.name)
      : (teamAliases[selectedTeam] ?? [selectedTeam]);

  return visibleTeamNames
    .map((teamName) => {
      const aliases = teamAliases[teamName] ?? [teamName];
      const resolvedName =
        pivotTeams.find((team) => aliases.includes(team.name))?.name ??
        teamsBySeason[seasons[0]]?.find((team) => aliases.includes(team.name))?.name ??
        teamName;
      const resolvedColor =
        pivotTeams.find((team) => aliases.includes(team.name))?.color ??
        teamsBySeason[seasons[0]]?.find((team) => aliases.includes(team.name))?.color ??
        "#334155";

      return {
        name: resolvedName,
        color: resolvedColor,
        key: keyFromTeamName(resolvedName),
      };
    })
    .filter((series, index, arr) => arr.findIndex((item) => item.name === series.name) === index);
}

function buildSeasonRows(teamsBySeason: Record<string, TeamStat[]>, teamSeries: TeamSeries[]) {
  const seasons = Object.keys(teamsBySeason).sort((a, b) => Number(a) - Number(b));

  return seasons.map((season) => {
    const row: Record<string, string | number> = { season };

    teamSeries.forEach((series) => {
      const aliases = teamAliases[series.name] ?? [series.name];
      const seasonTeam = (teamsBySeason[season] ?? []).find((team) => aliases.includes(team.name));
      row[series.key] = seasonTeam ? seasonTeam.points : 0;
    });

    return row;
  });
}

export function TeamPerformanceChart() {
  const { selectedSeason, selectedTeam } = useFilters();
  const [teamsBySeason, setTeamsBySeason] = useState<Record<string, TeamStat[]>>({});
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
    async function fetchTeamPerformance() {
      try {
        setLoading(true);
        const [teams2025Response, teams2026Response] = await Promise.all([
          api.getTeams({ season: "2025" }),
          api.getTeams({ season: "2026" }),
        ]);

        setTeamsBySeason({
          ...(teams2025Response.success ? { "2025": teams2025Response.data as TeamStat[] } : {}),
          ...(teams2026Response.success ? { "2026": teams2026Response.data as TeamStat[] } : {}),
        });
      } catch (error) {
        console.error("Error fetching team performance from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamPerformance();
  }, []);

  const teamSeries = buildTeamSeries(teamsBySeason, selectedSeason, selectedTeam);
  const teamPerformanceData = buildSeasonRows(teamsBySeason, teamSeries);
  const axisTickColor = isDarkMode ? "#cbd5e1" : "#475569";
  const gridStroke = isDarkMode ? "#334155" : "#e2e8f0";
  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      borderColor: isDarkMode ? "#334155" : "#cbd5e1",
      color: isDarkMode ? "#e2e8f0" : "#0f172a",
    }),
    [isDarkMode],
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <p className="text-center text-gray-600 dark:text-slate-300">Loading team performance from database...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
      <div className="border-b border-slate-200 p-6 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Team Performance Trends</h2>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
          Points scored by season{selectedTeam !== "all" ? ` for ${selectedTeam}` : " for top teams"}
        </p>
      </div>
      <div className="p-6">
        {teamPerformanceData.length === 0 || teamSeries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-400">No team trend data is available for the current filters.</p>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-slate-400">Season Points Comparison</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="season" tick={{ fill: axisTickColor, fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: axisTickColor, fontSize: 12 }}
                    label={{ value: "Points", angle: -90, position: "insideLeft", style: { fill: axisTickColor } }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: axisTickColor }} />
                  {teamSeries.map((series) => (
                    <Bar key={series.key} dataKey={series.key} fill={series.color} name={series.name} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-slate-400">Team Performance Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="season" tick={{ fill: axisTickColor, fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: axisTickColor, fontSize: 12 }}
                    label={{ value: "Points", angle: -90, position: "insideLeft", style: { fill: axisTickColor } }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: axisTickColor }} />
                  {teamSeries.map((series) => (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={series.color}
                      strokeWidth={3}
                      name={series.name}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}