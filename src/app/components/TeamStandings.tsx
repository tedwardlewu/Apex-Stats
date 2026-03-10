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

  // ...existing code...
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
    <div className="bg-card text-card-foreground border border-border shadow-lg rounded-lg">
      <div className="border-b p-6 bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-green-600 drop-shadow-md" />
          <h2 className="text-2xl font-extrabold text-green-900 tracking-tight">Constructor Standings</h2>
        </div>
      </div>
      <div className="p-8">
        <div className="space-y-6">
          {sortedTeams.map((team, index) => (
            <div key={team.id} className="flex items-center gap-4 p-2 rounded-md bg-gray-800 shadow border border-gray-700">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 font-bold text-gray-200 text-base">
                {index + 1}
              </div>
              <div
                className="w-1 h-16 rounded"
                style={{ backgroundColor: team.color }}
              />
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-700"
                style={{ backgroundColor: team.name === 'Ferrari' ? '#7a1a1a' : team.color || '#222' }}
              >
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-8 h-8 rounded-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base text-gray-200">{team.name}</p>
                <p className="text-xs text-gray-400">{team.championships} Championships</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-base text-gray-200">{team.points}</p>
                <p className="text-xs text-gray-400">pts</p>
              </div>
              <div className="flex gap-2 text-xs text-gray-400">
                <div className="text-center">
                  <p className="font-semibold text-gray-200">{team.wins}</p>
                  <p className="text-xs">Wins</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-200">{team.podiums}</p>
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