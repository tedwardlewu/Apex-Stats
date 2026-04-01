import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ReferenceLine } from "recharts";
import * as driverPointsApi from "../services/driverPointsApi";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";
import { raceCatalog } from "../data/raceLapTimes";
import { getTeamImage } from "../utils/teamImages";

interface Race {
  id: number;
  name: string;
  round: number;
}

interface DriverPoints {
  raceId: number;
  raceName: string;
  round: number;
  position: number;
  points: number;
}

interface Driver {
  id: number;
  name: string;
}

export function PointsProgressionGraph() {
  const { selectedSeason } = useFilters();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("Kimi Antonelli");
  const [progression, setProgression] = useState<DriverPoints[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDriversAndRaces() {
      setLoading(true);
      const [driversRes, racesRes] = await Promise.all([
        api.getDrivers({ season: selectedSeason }),
        api.getRaces({ season: selectedSeason })
      ]);
      if (driversRes.success) setDrivers(driversRes.data);
      if (racesRes.success) setRaces(racesRes.data as any);
      setLoading(false);
    }
    fetchDriversAndRaces();
  }, [selectedSeason]);

  useEffect(() => {
    async function fetchProgression() {
      if (!selectedDriver) return;
      setLoading(true);
      const res = await driverPointsApi.getDriverPointsProgression({ season: selectedSeason, driverName: selectedDriver });
      if (res.success) {
        // Ensure position is a number (not null) and calculate points earned per race
        let prevPoints = 0;
        const safeData = res.data.map((d: any) => {
          const pointsEarned = d.points - prevPoints;
          prevPoints = d.points;
          return { ...d, position: d.position ?? 20, pointsEarned };
        });
        setProgression(safeData);
      }
      setLoading(false);
    }
    fetchProgression();
  }, [selectedSeason, selectedDriver]);

  // Get country flag for each race
  const getFlag = (country: string) => {
    const flagMap: Record<string, string> = {
      "Australia": "/Countries/Australia.webp",
      "China": "/Countries/China.png",
      "Japan": "/Countries/Japan.png",
      "United Kingdom": "/Countries/UK.webp",
      "Great Britain": "/Countries/UK.webp",
      "Monaco": "/Countries/Monaco.svg",
      "Spain": "/Countries/Spain.svg",
      "France": "/Countries/France.webp",
      "Italy": "/Countries/Italy.webp",
      "Germany": "/Countries/Germany.webp",
      "Brazil": "/Countries/Brazil.webp",
      "Argentina": "/Countries/Argentina.webp",
      "New Zealand": "/Countries/NewZealand.webp",
      "Mexico": "/Countries/Mexico.svg",
      "Finland": "/Countries/Finland.png",
      "Canada": "/Countries/Canada.svg",
      "Thailand": "/Countries/Thailand.png",
      "Belgium": "/Countries/Belgian.avif",
      // Add more as needed
    };
    for (const key in flagMap) {
      if (country.includes(key)) return flagMap[key];
    }
    return "";
  };

  // Compose x axis ticks with flag and race name
  const xTicks = progression.map((p, i) => {
    const race = raceCatalog.find(r => r.name === p.raceName && r.season === selectedSeason);
    const flag = race ? getFlag(race.country) : "";
    return {
      value: p.raceName,
      flag,
      label: p.raceName,
      index: i,
    };
  });

  // Custom X axis tick renderer
  const renderCustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const tick = xTicks[payload.index];
    return (
      <g transform={`translate(${x},${y})`}>
        {tick.flag ? (
          <image href={tick.flag} x={-12} y={-18} height="18" width="24" />
        ) : null}
        <text y={10} x={0} textAnchor="middle" fill="#fff" fontWeight={700} fontSize="13">
          {tick.label}
        </text>
        <text y={32} x={0} textAnchor="middle" fill="#fff" fontWeight={500} fontSize="12">
          {tick.flag && raceCatalog.find(r => r.name === tick.label && r.season === selectedSeason)?.country}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-gray-700">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <label htmlFor="driver-select" className="font-semibold text-blue-900 dark:text-blue-200">Driver:</label>
        <select
          id="driver-select"
          value={selectedDriver}
          onChange={e => setSelectedDriver(e.target.value)}
          className="border border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm transition w-full sm:w-auto"
        >
          {drivers.map(driver => (
            <option key={driver.id} value={driver.name}>{driver.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{selectedDriver} Points Progression</span>
      </div>
      {/* Driver info section */}
      <div className="flex items-center gap-4 mb-4">
        {/* Driver profile picture */}
        {drivers.length > 0 && (() => {
          const driverObj = drivers.find(d => d.name === selectedDriver);
          if (!driverObj) return null;
          const driverImage = driverObj.image;
          const team = driverObj.team;
          const teamLogo = getTeamImage(team);
          return <>
            <img
              src={driverImage}
              alt={selectedDriver}
              className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover bg-white"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-900 dark:text-blue-200">{selectedDriver}</span>
              <span className="flex items-center gap-2 mt-1">
                {teamLogo && <img src={teamLogo} alt={team} className="w-8 h-8 object-contain bg-white rounded-full border border-blue-300" />}
                <span className="text-base font-semibold text-blue-700 dark:text-blue-300">{team}</span>
              </span>
            </div>
          </>;
        })()}
      </div>
      <ResponsiveContainer width="100%" height={520}>
        <LineChart data={progression} margin={{ top: 60, right: 40, left: 10, bottom: 50 }}>
          <defs>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#c7d2fe" />
          <XAxis
            dataKey="raceName"
            interval={0}
            tick={renderCustomXAxisTick}
            height={70}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            domain={[1, 20]}
            reversed
            allowDecimals={false}
            label={{ value: "Position", angle: -90, position: "insideLeft", fill: '#2563eb', fontWeight: 700 }}
            tick={{ fill: '#fff', fontWeight: 600 }}
            ticks={[...Array(20).keys()].map(i => i + 1)}
          />
          <Tooltip contentStyle={{ background: '#f1f5f9', border: '1px solid #2563eb', color: '#1e293b' }} formatter={(value: any, name: string) => name === "points" ? `${value} pts` : value} />
          <Line type="linear" dataKey="position" stroke="#2563eb" strokeWidth={3} dot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} fill="url(#colorPos)">
            <LabelList
              dataKey="pointsEarned"
              position="top"
              formatter={(v: any) => `${v} pts`}
              fill="#2563eb"
              fontWeight={700}
              content={({ x, y, value }) => {
                const safeX = typeof x === 'number' ? x : 0;
                const safeY = typeof y === 'number' ? y : 0;
                return (
                  <text x={safeX} y={safeY - 16} textAnchor="middle" fill="#fff" fontWeight={700} fontSize="13">{value} pts</text>
                );
              }}
            />
          </Line>
          <ReferenceLine y={1} stroke="#22d3ee" strokeDasharray="4 2" label={{ value: "P1", position: "top", fill: '#22d3ee', fontWeight: 700 }} />
        </LineChart>
      </ResponsiveContainer>
      {loading && <div className="text-center mt-2 text-blue-700 dark:text-blue-200">Loading...</div>}
    </div>
  );
}
