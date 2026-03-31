import { useState } from "react";
import { useFilters } from "../contexts/FilterContext";
import * as api from "../services/api";

export function DriverDetailAnalysis({ driverId }: { driverId: number }) {
  const { selectedSeason } = useFilters();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchDriverStats() {
    setLoading(true);
    const response = await api.getDriverById(driverId);
    if (response.success) {
      setStats(response.data);
    }
    setLoading(false);
  }

  // Fetch on mount or when driverId/season changes
  React.useEffect(() => {
    fetchDriverStats();
    // Optionally fetch more in-depth stats here
  }, [driverId, selectedSeason]);

  if (loading) return <div>Loading driver analysis...</div>;
  if (!stats) return <div>No data for this driver.</div>;

  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-slate-900/80">
      <h2 className="text-xl font-bold mb-2">Driver Analysis: {stats.name}</h2>
      <ul className="mb-2">
        <li>Team: {stats.team}</li>
        <li>Points: {stats.points}</li>
        <li>Wins: {stats.wins}</li>
        <li>Podiums: {stats.podiums}</li>
        <li>Championships: {stats.championships}</li>
        {/* Add more advanced stats here */}
      </ul>
      {/* Add charts, lap time breakdowns, consistency, etc. */}
    </div>
  );
}
