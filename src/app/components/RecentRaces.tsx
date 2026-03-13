import { useState, useEffect } from "react";
import { Flag, Trophy } from "lucide-react";
import * as api from "../services/api";

interface Race {
  id: number;
  name: string;
  country: string;
  date: string;
  circuit: string;
  winner: string;
  fastestLap: string;
}

export function RecentRaces() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRaces() {
      try {
        setLoading(true);
        const response = await api.getRaces();
        if (response.success) {
          setRaces(response.data);
        }
      } catch (error) {
        console.error("Error fetching races from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRaces();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-sm p-6">
        <p className="text-center text-gray-300">Loading races from database...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm text-gray-200">
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <Flag className="size-5 text-red-600" />
          <h2 className="text-xl font-bold">Recent Races</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {races.map((race) => (
            <div
              key={race.id}
              className="p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{race.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{race.circuit}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Flag className="size-4" />
                      <span>{race.country}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Trophy className="size-4" />
                      <span>{new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Winner</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 bg-yellow-500 rounded" />
                    <p className="font-semibold">{race.winner}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Fastest Lap</p>
                  <div className="flex items-center gap-2">
                    <Trophy className="size-4 text-purple-600" />
                    <p className="font-semibold">{race.fastestLap}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}