import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import * as api from "../services/api";

interface Team {
  id: number;
  name: string;
  color: string;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
  image: string;
}

export function TeamStandings() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teams from SQL backend
  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const response = await api.getTeams();
        if (response.success) {
          setTeams(response.data);
        }
      } catch (error) {
        console.error("Error fetching teams from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-center text-gray-600">Loading team standings from database...</p>
      </div>
    );
  }

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-blue-600" />
          <h2 className="text-xl font-bold">Constructor Standings</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-700">
                {index + 1}
              </div>
              <div
                className="w-1 h-12 rounded"
                style={{ backgroundColor: team.color }}
              />
              <img
                src={team.image}
                alt={team.name}
                className="w-8 h-8 rounded-full object-cover object-top border-2 border-gray-200"
              />
              <div className="flex-1">
                <p className="font-semibold">{team.name}</p>
                <p className="text-sm text-gray-600">{team.championships} Championships</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{team.points}</p>
                <p className="text-xs text-gray-600">points</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{team.wins}</p>
                  <p className="text-xs">Wins</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{team.podiums}</p>
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