import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getTeamImage, getTeamImageStyle } from "../utils/teamImages";

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

interface TeamStandingsProps {
  onViewCars?: () => void;
}

export function TeamStandings({ onViewCars }: TeamStandingsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedSeason } = useFilters();
  const { memeify } = useMemeify();

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const response = await api.getTeams({ season: selectedSeason });
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
  }, [selectedSeason]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-100 p-6 dark:border-border dark:bg-gray-800">
        <p className="text-center text-gray-600 dark:text-gray-300">Loading team standings from database...</p>
      </div>
    );
  }

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-100 text-slate-900 dark:border-border dark:bg-card dark:text-card-foreground">
      <div className="rounded-t-lg border-b border-slate-200 bg-slate-200 p-6 dark:border-border dark:bg-gray-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Users className="size-6 text-green-600" />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Constructor Standings</h2>
          </div>
          {onViewCars && (
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-slate-700"
              onClick={onViewCars}
            >
              View Cars
            </button>
          )}
        </div>
      </div>
      <div className="p-8">
        <div className="space-y-6">
          {sortedTeams.map((team, index) => (
            <div key={team.id} className="flex items-center gap-4 rounded-md border border-slate-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-base font-bold text-white">
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
                  src={getTeamImage(team.name, team.image, memeify)}
                  alt={team.name}
                  className="w-8 h-8 rounded-full object-cover object-top"
                  style={getTeamImageStyle(team.name, memeify)}
                />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 dark:text-gray-200">{team.name}</p>
                <p className="text-xs text-slate-600 dark:text-gray-400">{team.championships} Championships</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-slate-900 dark:text-gray-200">{team.points}</p>
                <p className="text-xs text-slate-600 dark:text-gray-400">pts</p>
              </div>
              <div className="flex gap-2 text-xs text-slate-600 dark:text-gray-400">
                <div className="text-center">
                  <p className="font-semibold text-slate-900 dark:text-gray-200">{team.wins}</p>
                  <p className="text-xs">Wins</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 dark:text-gray-200">{team.podiums}</p>
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