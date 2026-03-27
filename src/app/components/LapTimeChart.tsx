import { useState, useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";

interface Race {
  id: number;
  name: string;
  season: string;
  date: string;
}

interface DriverBestLap {
  driverName: string;
  bestLap: number;
}

interface Driver {
  name: string;
  team: string;
}

interface Team {
  name: string;
  color: string;
}

type TopView = "top5" | "top10" | "all";

const topViewOptions: { key: TopView; label: string; limit: number }[] = [
  { key: "top5", label: "Top 5", limit: 5 },
  { key: "top10", label: "Top 10", limit: 10 },
  { key: "all", label: "All 22", limit: 22 },
];

function formatLapTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;
  return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, "0")}`;
}

export function LapTimeChart() {
  const { selectedSeason } = useFilters();
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [lapTimeData, setLapTimeData] = useState<DriverBestLap[]>([]);
  const [selectedView, setSelectedView] = useState<TopView>("all");
  const [driverTeams, setDriverTeams] = useState<Record<string, string>>({});
  const [teamColors, setTeamColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRaces() {
      try {
        setLoading(true);
        const response = await api.getRaces({ season: selectedSeason });
        if (response.success) {
          setRaces(response.data);
          setSelectedRaceId(response.data[0]?.id ?? null);
        }
      } catch (error) {
        console.error("Error fetching races for lap times:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRaces();
  }, [selectedSeason]);

  useEffect(() => {
    async function fetchDriverAndTeamColors() {
      try {
        const [driversResponse, teamsResponse] = await Promise.all([
          api.getDrivers({ season: selectedSeason }),
          api.getTeams({ season: selectedSeason }),
        ]);

        if (driversResponse.success) {
          const nextDriverTeams = driversResponse.data.reduce<Record<string, string>>((acc, driver: Driver) => {
            acc[driver.name] = driver.team;
            return acc;
          }, {});
          setDriverTeams(nextDriverTeams);
        }

        if (teamsResponse.success) {
          const nextTeamColors = teamsResponse.data.reduce<Record<string, string>>((acc, team: Team) => {
            acc[team.name] = team.color;
            return acc;
          }, {});
          setTeamColors(nextTeamColors);
        }
      } catch (error) {
        console.error("Error fetching driver/team colors for lap chart:", error);
      }
    }

    fetchDriverAndTeamColors();
  }, [selectedSeason]);

  useEffect(() => {
    if (!selectedRaceId) {
      setLapTimeData([]);
      return;
    }

    async function fetchLapTimes() {
      try {
        setLoading(true);
        const response = await api.getLapTimes({ season: selectedSeason, raceId: selectedRaceId ?? undefined });
        if (response.success) {
          setLapTimeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching lap times from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLapTimes();
  }, [selectedRaceId, selectedSeason]);

  const selectedRace = races.find((race) => race.id === selectedRaceId) ?? null;
  const selectedViewConfig = topViewOptions.find((option) => option.key === selectedView) ?? topViewOptions[topViewOptions.length - 1];
  const baselineLap = lapTimeData.length > 0 ? lapTimeData[0].bestLap : null;
  const displayedLapTimes = lapTimeData
    .filter((entry) => Number.isFinite(Number(entry.bestLap)))
    .slice(0, selectedViewConfig.limit)
    .map((entry, index) => ({
      ...entry,
      bestLap: Number(entry.bestLap),
      lapLabel: formatLapTime(Number(entry.bestLap)),
      insideLapLabel: index === 0 ? "" : formatLapTime(Number(entry.bestLap)),
      gapFromLeader: baselineLap !== null ? Number((Number(entry.bestLap) - Number(baselineLap)).toFixed(3)) : 0,
      rightLabel: index === 0
        ? formatLapTime(Number(entry.bestLap))
        : `+${(baselineLap !== null ? Number(entry.bestLap) - Number(baselineLap) : 0).toFixed(3)}s`,
      rank: index + 1,
    }));

  const minLap = Math.min(...displayedLapTimes.map((entry) => entry.bestLap));
  const maxLap = Math.max(...displayedLapTimes.map((entry) => entry.bestLap));
  const hasFiniteDomain = Number.isFinite(minLap) && Number.isFinite(maxLap);
  const xDomain: [number, number] = hasFiniteDomain
    ? [
        Number((minLap - 0.05).toFixed(3)),
        Number((Math.max(maxLap + 0.05, minLap + 0.1)).toFixed(3)),
      ]
    : [0, 1];
  const chartHeight = Math.max(280, displayedLapTimes.length * 30 + 80);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-sm p-6">
        <p className="text-center text-gray-300">Loading lap times from database...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm text-gray-200">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">Lap Time Analysis</h2>
        <p className="mt-1 text-sm text-gray-600">
          Select a race and compare best laps across the full field. Choose one view at a time: Top 5, Top 10, or All 22.
        </p>
      </div>
      <div className="p-6">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">Race</label>
            <select
              value={selectedRaceId ?? ""}
              onChange={(event) => setSelectedRaceId(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100"
            >
              {races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name} ({new Date(race.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-400">
            {selectedRace ? `${selectedRace.name} - ${selectedRace.season} season` : "No race selected"}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {topViewOptions.map((option) => {
            const isActive = selectedView === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedView(option.key)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "border-green-400 bg-green-500/20 text-green-200"
                    : "border-gray-600 bg-gray-900 text-gray-300 hover:border-gray-500"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mb-8 rounded-lg border border-gray-700 bg-gray-900/40 p-4">
          <h3 className="mb-3 text-base font-semibold text-gray-100">{selectedViewConfig.label} Best Laps</h3>
          {displayedLapTimes.length === 0 ? (
            <p className="text-sm text-gray-400">No lap time data is available for this race.</p>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={displayedLapTimes} layout="vertical" margin={{ top: 8, right: 110, left: 24, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  dataKey="bestLap"
                  domain={xDomain}
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                  name="Best Lap"
                  unit="s"
                />
                <YAxis
                  type="category"
                  dataKey="driverName"
                  width={150}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number | string) => [`${Number(value).toFixed(3)}s`, "Best Lap"]}
                  labelFormatter={(label) => `Driver: ${label}`}
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                />
                <Bar dataKey="bestLap" radius={[0, 8, 8, 0]}>
                  {displayedLapTimes.map((entry) => {
                    const teamName = driverTeams[entry.driverName];
                    const fillColor = (teamName && teamColors[teamName]) || "#22c55e";
                    return <Cell key={entry.driverName} fill={fillColor} />;
                  })}
                  <LabelList
                    dataKey="insideLapLabel"
                    position="insideRight"
                    offset={8}
                    fill="#f8fafc"
                    fontSize={12}
                    fontWeight={700}
                  />
                  <LabelList
                    dataKey="rightLabel"
                    position="right"
                    offset={10}
                    fill="#cbd5e1"
                    fontSize={12}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}