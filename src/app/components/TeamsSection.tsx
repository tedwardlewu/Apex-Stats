import { useState, useEffect } from "react";
import * as api from "../services/api";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamDisplayName, getTeamImage, getTeamImageStyle } from "../utils/teamImages";

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

export function TeamsSection() {
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
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Teams</h2>
      <div className="flex flex-col gap-8">
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
              alt={getTeamDisplayName(team.name, memeify) + " logo"}
              className="w-32 h-32 object-contain drop-shadow-xl"
              style={getTeamImageStyle(team.name, memeify)}
            />

            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-md">{getTeamDisplayName(team.name, memeify)}</h3>
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
    </div>
  );
}
