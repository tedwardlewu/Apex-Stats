import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import * as api from "../services/api";

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
}

export function DriverStandings() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch drivers from SQL backend
  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        const response = await api.getDrivers();
        if (response.success) {
          setDrivers(response.data);
        }
      } catch (error) {
        console.error("Error fetching drivers from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-center text-gray-600">Loading driver standings from database...</p>
      </div>
    );
  }

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-yellow-600" />
          <h2 className="text-xl font-bold">Driver Standings</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {sortedDrivers.map((driver, index) => (
            <div
              key={driver.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-700">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{driver.name}</span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                    #{driver.number}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{driver.team}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{driver.points}</p>
                <p className="text-xs text-gray-600">points</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{driver.wins}</p>
                  <p className="text-xs">Wins</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{driver.podiums}</p>
                  <p className="text-xs">Podiums</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}