import { useState, useEffect } from "react";
import * as api from "../services/api";

interface Team {
  id: number;
  name: string;
  color: string;
  image: string;
}

interface Driver {
  id: number;
  name: string;
  image: string;
  team: string;
}

export function TeamsSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      const response = await api.getTeams();
      if (response.success) setTeams(response.data);
    }
    async function fetchDrivers() {
      const response = await api.getDrivers();
      if (response.success) setDrivers(response.data);
    }
    fetchTeams();
    fetchDrivers();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Teams</h2>
      <div className="flex flex-col gap-8">
        {teams.map(team => (
          <div
            key={team.id}
            className="flex items-center gap-8 p-6 rounded-lg"
            onMouseEnter={() => setHoveredTeam(team.name)}
            onMouseLeave={() => setHoveredTeam(null)}
            style={{ background: team.color, boxShadow: hoveredTeam === team.name ? '0 4px 16px rgba(0,0,0,0.15)' : undefined }}
          >
            <img
              src={team.image}
              alt={team.name + " logo"}
              className="w-32 h-32 object-contain"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
            </div>
            <img
              src={"/Cars/" + team.name.replace(/ /g, "") + ".avif"}
              alt={team.name + " car"}
              className="w-[500px] h-48 object-contain"
            />
            {hoveredTeam === team.name && (
              <div className="absolute top-1/2 right-0 bg-white rounded-lg p-4 flex gap-4 z-10 shadow-lg" style={{ transform: 'translateY(-50%)' }}>
                {drivers
                  .filter(d => d.team === team.name)
                  .map(driver => (
                    <img
                      key={driver.id}
                      src={driver.image}
                      alt={driver.name}
                      className="w-32 h-32 object-contain"
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
