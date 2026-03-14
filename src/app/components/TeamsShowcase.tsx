import { useState, useEffect } from "react";
import * as api from "../services/api";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamImage, getTeamImageStyle } from "../utils/teamImages";

const teamCarImage: Record<string, string> = {
  Mercedes: "Mercedes.avif",
  Ferrari: "Ferrari.avif",
  McLaren: "McLaren.avif",
  "Red Bull Racing": "Redbull.avif",
  "Haas F1 Team": "Haas.avif",
  "Racing Bulls": "Racingbulls.avif",
  Audi: "Audi.avif",
  Alpine: "Alpine.avif",
  Williams: "Williams.avif",
  Cadillac: "Cadillac.avif",
  "Aston Martin": "Aston.avif",
};

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

export function TeamsShowcase() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showDrivers, setShowDrivers] = useState<string | null>(null);
  const [carHidden, setCarHidden] = useState<string | null>(null);
  const { memeify } = useMemeify();

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
    <section id="teams-showcase-section" className="relative bg-gradient-to-br from-gray-900 via-gray-700 to-blue-900 rounded-lg p-6 mt-12 overflow-hidden shadow-xl">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="carBgGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <ellipse cx="400" cy="200" rx="350" ry="120" fill="url(#carBgGradient)" />
        <ellipse cx="400" cy="350" rx="200" ry="40" fill="#3b82f6" fillOpacity="0.08" />
      </svg>
      <h2 className="relative z-10 text-2xl font-bold mb-6 text-white drop-shadow-lg">Teams Showcase</h2>
      <div className="relative z-10 flex flex-col gap-8">
        {teams.map(team => (
          <div
            key={team.id}
            className="flex items-center gap-8 p-6 rounded-lg relative bg-gradient-to-r from-black/60 via-blue-900/40 to-transparent shadow-lg backdrop-blur-md"
            onMouseEnter={() => {
              setCarHidden(null);
              setShowDrivers(null);
              setTimeout(() => {
                setCarHidden(team.name);
                setTimeout(() => {
                  setShowDrivers(team.name);
                }, 350);
              }, 10);
            }}
            onMouseLeave={() => {
              setShowDrivers(null);
              setCarHidden(null);
            }}
            style={{ background: team.color ? `linear-gradient(90deg, ${team.color} 0%, #1e293b 100%)` : undefined }}
          >
            <img
              src={getTeamImage(team.name, team.image, memeify)}
              alt={team.name + " logo"}
              className="w-32 h-32 object-contain drop-shadow-xl"
              style={getTeamImageStyle(team.name, memeify)}
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-md">{team.name}</h3>
            </div>
            <div className="w-[500px] h-48 flex items-center justify-center">
              <div className="relative w-full h-full">
                <img
                  src={"/Cars/" + teamCarImage[team.name]}
                  alt={team.name + " car"}
                  className="absolute left-0 top-0 w-[500px] h-48 object-contain rounded-xl shadow-2xl bg-white/10 backdrop-blur-sm transition-opacity duration-500"
                  style={{ opacity: carHidden === team.name ? 0 : 1, zIndex: carHidden === team.name ? 1 : 2 }}
                />
                {showDrivers === team.name && carHidden === team.name && (
                  <div className="flex items-center justify-center w-full h-full">
                    {drivers
                      .filter(d => d.team === team.name)
                      .map((driver, idx) => (
                        <div
                          key={driver.id}
                          className="mx-2 h-48 w-48 overflow-hidden rounded-xl bg-white/10 shadow-lg backdrop-blur-sm transition-opacity duration-500"
                          style={{
                            opacity: showDrivers === team.name ? 1 : 0,
                            transitionDelay: `${idx * 100}ms`,
                          }}
                        >
                          <img
                            src={getDriverImage(driver.name, driver.image, memeify)}
                            alt={driver.name}
                            className="h-full w-full object-contain"
                            style={getDriverImageStyle(driver.name, memeify)}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
