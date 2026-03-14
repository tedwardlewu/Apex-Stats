const teamLogoImages: Record<string, string> = {
  "Mercedes": "/Team Images/Mercedes.avif",
  "Ferrari": "/Team Images/Ferrari.avif",
  "McLaren": "/Team Images/McLaren.avif",
  "Red Bull Racing": "/Team Images/Redbull.avif",
  "Williams": "/Team Images/Williams.avif",
  "Cadillac": "/Team Images/Cadillac.avif",
  "Aston Martin": "/Team Images/Aston.avif",
  "Audi": "/Team Images/Audi.avif",
  "Kick Sauber": "/Team Images/Sauber.avif",
  "Sauber": "/Team Images/Sauber.avif",
  "Alpine": "/Team Images/Alpine.avif",
  "Haas F1 Team": "/Team Images/Haas.avif",
  "Racing Bulls": "/Team Images/Racingbulls.avif",
};

function getTeamLogo(team: string) {
  return teamLogoImages[team] || "";
}
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamImage, getTeamImageStyle } from "../utils/teamImages";

interface Driver {
  id: number;
  name: string;
  number: number;
  team: string;
  nationality: string;
  age: number;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
  image: string;
}

const flagImages: Record<string, string> = {
  "Netherlands": "/Countries/Dutch.webp",
  "France": "/Countries/France.webp",
  "Monaco": "/Countries/Monaco.svg",
  "Great Britain": "/Countries/UK.webp",
  "United Kingdom": "/Countries/UK.webp",
  "Italy": "/Countries/Italy.webp",
  "Australia": "/Countries/Australia.webp",
  "Spain": "/Countries/Spain.svg",
  "Germany": "/Countries/Germany.webp",
  "Brazil": "/Countries/Brazil.webp",
  "Argentina": "/Countries/Argentina.webp",
  "New Zealand": "/Countries/NewZealand.webp",
  "Mexico": "/Countries/Mexico.svg",
  "Finland": "/Countries/Finland.png",
  "Canada": "/Countries/Canada.svg",
  "Japan": "/Countries/Japan.png",
  "Thailand": "/Countries/Thailand.png",
};

function getFlagImg(nationality: string) {
  return flagImages[nationality] || "";
}

export function DriverStandings() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, selectedTeam, selectedSeason } = useFilters();
  const { memeify } = useMemeify();

  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        const response = await api.getDrivers({
          search: searchQuery,
          team: selectedTeam,
          season: selectedSeason,
        });
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
  }, [searchQuery, selectedTeam, selectedSeason]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-100 p-6 dark:border-border dark:bg-gray-800">
        <p className="text-center text-gray-600 dark:text-gray-300">Loading driver standings from database...</p>
      </div>
    );
  }

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  const teamColors: { [team: string]: string } = {
    "Mercedes": "#06B6D4",
    "Ferrari": "#c92c2c",
    "McLaren": "#F97316",
    "Red Bull Racing": "#1c46ce",
    "Williams": "#104fb4",
    "Cadillac": "#444749",
    "Aston Martin": "#10853b",
    "Audi": "#771716",
    "Kick Sauber": "#39FF14",
    "Sauber": "#39FF14",
    "Alpine": "#2871cb",
    "Haas F1 Team": "#d1d1d1",
    "Racing Bulls": "#7594c2",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-100 text-slate-900 dark:border-border dark:bg-card dark:text-card-foreground">
      <div className="rounded-t-lg border-b border-slate-200 bg-slate-200 p-6 dark:border-border dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <Trophy className="size-6 text-yellow-600" />
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Driver Standings</h2>
        </div>
      </div>
      <div className="p-8">
        <div className="space-y-6">
          {sortedDrivers.map((driver, index) => (
            <div
              key={driver.id}
              className="flex items-center gap-4 rounded-md border border-slate-200 bg-white p-2 text-slate-900 dark:border-border dark:bg-[#1a1f2b] dark:text-card-foreground"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-base font-bold text-white">
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                {getFlagImg(driver.nationality) && (
                  <img
                    src={getFlagImg(driver.nationality)}
                    alt={driver.nationality + " flag"}
                    className="w-8 h-8 rounded-full border border-gray-700 object-cover"
                  />
                )}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border border-gray-700"
                  style={{ backgroundColor: driver.team === 'Ferrari' ? '#c92c2c' : teamColors[driver.team] || '#222' }}
                >
                  <img
                    src={getDriverImage(driver.name, driver.image, memeify)}
                    alt={driver.name}
                    className="w-14 h-14 rounded-full object-cover object-[center_-10%]"
                    style={getDriverImageStyle(driver.name, memeify)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">{driver.name}</span>
                  <span className="rounded bg-gray-700 px-2 py-0.5 text-xs font-medium text-white">
                    #{driver.number}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                </div>
                <p className="mt-1 text-xs text-slate-700 dark:text-white">{driver.team}</p>
              
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={getTeamImage(driver.team, getTeamLogo(driver.team), memeify)}
                  alt={driver.team + " logo"}
                  className="w-6 h-6 rounded-full border border-gray-700 mx-4"
                  style={{
                    ...getTeamImageStyle(driver.team, memeify),
                    backgroundColor: driver.team === 'Ferrari' ? '#c92c2c' : teamColors[driver.team] || '#222',
                  }}
                />
              </div>
              <div className="flex flex-col items-end min-w-[60px]">
                <p className="text-base font-bold text-slate-900 dark:text-white">{driver.points}</p>
                <p className="text-xs text-slate-700 dark:text-white">pts</p>
              </div>
              <div className="flex gap-2 text-xs text-gray-400">
                <div className="text-center">
                  <p className="font-semibold text-slate-900 dark:text-white">{driver.wins}</p>
                  <p className="text-xs text-slate-700 dark:text-white">Wins</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 dark:text-white">{driver.podiums}</p>
                  <p className="text-xs text-slate-700 dark:text-white">Podiums</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}