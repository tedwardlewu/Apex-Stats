
import React, { useState } from "react";
import { useFilters } from "../contexts/FilterContext";
import * as api from "../services/api";
import { useMemeify } from "../contexts/MemeifyContext";

import { getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getDriverBackgroundImage, getDriverBackgroundPosition, getDriverBackgroundSize } from "../utils/driverBackgrounds";

const TEAM_COLORS: Record<string, string> = {
  Mercedes: "#06B6D4",
  Ferrari: "#c92c2c",
  McLaren: "#F97316",
  "Red Bull Racing": "#1c46ce",
  Williams: "#104fb4",
  Cadillac: "#444749",
  "Aston Martin": "#10853b",
  Audi: "#771716",
  "Kick Sauber": "#39FF14",
  Sauber: "#39FF14",
  Alpine: "#2871cb",
  "Haas F1 Team": "#d1d1d1",
  "Racing Bulls": "#7594c2",
};


export function DriverDetailAnalysis({ driver }: { driver: any }) {
  const { selectedSeason } = useFilters();
  const [lastSeasonStats, setLastSeasonStats] = useState<any>(null);
  const { memeify } = useMemeify();

  React.useEffect(() => {
    const fetchLastSeason = async () => {
      const lastSeason = (parseInt(selectedSeason) - 1).toString();
      const lastSeasonDrivers = await api.getDrivers({ season: lastSeason });
      if (lastSeasonDrivers.success) {
        const last = lastSeasonDrivers.data.find((d: any) => d.id === driver.id);
        setLastSeasonStats(last);
      }
    };
    fetchLastSeason();
  }, [driver.id, selectedSeason]);

  if (!driver) return <div className="p-8 text-center text-lg font-semibold">No data for this driver.</div>;

  const backgroundImage = encodeURI(getDriverBackgroundImage(driver.name, driver.image));
  const teamColor = TEAM_COLORS[driver.team] ?? '#64748b';

  return (
    <div
      className="max-w-3xl w-full mx-auto rounded-2xl border-2 bg-white p-0 shadow-sm flex flex-row gap-0 relative dark:bg-slate-900 overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${teamColor}22 0%, #fff8 100%)`,
      }}
    >
      <div
        className="flex-1 min-w-[220px] max-w-[320px] flex items-center justify-center relative bg-slate-100 dark:bg-slate-800"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(0.95) contrast(0.95) brightness(0.92)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/0 to-transparent dark:from-slate-900/80" />
      </div>
      <div className="flex-[2] p-8 flex flex-col justify-center relative z-10">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div
            className="relative mb-2 flex items-center justify-center"
            style={{
              background: teamColor,
              borderRadius: '9999px',
              width: '104px',
              height: '104px',
              boxShadow: `0 0 0 4px ${teamColor}55, 0 2px 16px 0 #0002`,
            }}
          >
            <img
              src={getDriverImage(driver.name, driver.image, memeify)}
              alt={driver.name}
              className="h-24 w-24 rounded-full object-cover object-[center_-10%] shadow-lg"
              style={{
                ...getDriverImageStyle(driver.name, memeify),
                background: teamColor,
                borderRadius: '9999px',
              }}
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{driver.name}</h2>
          <div className="text-base font-semibold text-slate-600 dark:text-slate-300">{driver.team}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center">
            <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">Current Season</div>
            <div>Points: <span className="font-semibold">{driver.points}</span></div>
            <div>Wins: <span className="font-semibold">{driver.wins}</span></div>
            <div>Podiums: <span className="font-semibold">{driver.podiums}</span></div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center">
            <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">Past Season</div>
            {lastSeasonStats ? (
              <>
                <div>Points: <span className="font-semibold">{lastSeasonStats.points}</span></div>
                <div>Wins: <span className="font-semibold">{lastSeasonStats.wins}</span></div>
                <div>Podiums: <span className="font-semibold">{lastSeasonStats.podiums}</span></div>
              </>
            ) : (
              <div className="italic text-slate-400">No data</div>
            )}
          </div>
        </div>
        <ul className="mt-2 mb-2 text-sm flex flex-col gap-1 items-center">
          <li>Nationality: <span className="font-medium">{driver.nationality}</span></li>
          <li>Championships: <span className="font-medium">{driver.championships}</span></li>
          <li>Age: <span className="font-medium">{driver.age ?? 'N/A'}</span></li>
        </ul>
      </div>
    </div>
  );
}
