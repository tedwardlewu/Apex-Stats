import { Driver } from "../data/mockData";
import { Trophy, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getDriverBackgroundImage, getDriverBackgroundPosition } from "../utils/driverBackgrounds";
import { getTeamDisplayName } from "../utils/teamImages";

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

const TEAM_LOGO_IMAGES: Record<string, string> = {
  Mercedes: "/Team Images/Mercedes.avif",
  Ferrari: "/Team Images/Ferrari.avif",
  McLaren: "/Team Images/McLaren.avif",
  "Red Bull Racing": "/Team Images/Redbull.avif",
  Williams: "/Team Images/Williams.avif",
  Cadillac: "/Team Images/Cadillac.avif",
  "Aston Martin": "/Team Images/Aston.avif",
  Audi: "/Team Images/Audi.avif",
  "Kick Sauber": "/Team Images/Sauber.avif",
  Sauber: "/Team Images/Sauber.avif",
  Alpine: "/Team Images/Alpine.avif",
  "Haas F1 Team": "/Team Images/Haas.avif",
  "Racing Bulls": "/Team Images/Racingbulls.avif",
};

interface DriverCardProps {
  driver: Driver;
  rank: number;
  isSelected?: boolean;
  onSelect?: (driver: Driver) => void;
  showImage?: boolean;
  showTeam?: boolean;
}

export function DriverCard({ driver, rank, isSelected, onSelect, showImage = true, showTeam = true }: DriverCardProps) {
  const { memeify } = useMemeify();
  const displayName = getDriverDisplayName(driver.name, memeify);
  const backgroundImage = encodeURI(getDriverBackgroundImage(driver.name, driver.image));
  const backgroundPosition = getDriverBackgroundPosition(driver.name);
  const teamLogo = TEAM_LOGO_IMAGES[driver.team] ?? "";
  const teamColor = TEAM_COLORS[driver.team] ?? "#64748b";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      className={`relative cursor-pointer overflow-hidden rounded-lg border-2 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/70'
          : 'border-gray-200/90 dark:border-slate-700'
      }`}
      onClick={() => onSelect?.(driver)}
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[66%] transition-opacity duration-500"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          backgroundSize: "cover",
          backgroundPosition,
          backgroundRepeat: "no-repeat",
          filter: "saturate(0.9) contrast(0.9) brightness(0.84)",
          opacity: 0.88,
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0.62) 30%, black 44%, black 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0.62) 30%, black 44%, black 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 right-[60%] w-[18%] bg-gradient-to-r from-white/58 via-white/18 to-transparent dark:from-slate-900/58 dark:via-slate-900/18 dark:to-transparent" />

      {isSelected && (
        <div className="absolute right-3 top-3 z-20">
          <CheckCircle2 className="size-6 text-blue-500" />
        </div>
      )}

      <div className="relative z-10 flex items-start gap-4">
        {showImage ? (
          <div className="relative">
            <img
              src={getDriverImage(driver.name, driver.image, memeify)}
              alt={displayName}
              className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover object-[center_-10%] dark:border-slate-700"
              style={getDriverImageStyle(driver.name, memeify)}
            />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-yellow-500 text-[10px] font-bold dark:border-slate-900">
              {rank}
            </div>
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-slate-950">
            {rank}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{displayName}</h3>
          {showTeam ? (
            <div className="mt-0.5 flex items-center gap-1.5">
              {teamLogo ? (
                <span
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${teamColor}33` }}
                >
                  <img src={teamLogo} alt={`${driver.team} logo`} className="h-3 w-3 rounded-full object-cover" />
                </span>
              ) : null}
              <p className="truncate text-sm text-slate-700 dark:text-slate-300">{getTeamDisplayName(driver.team, memeify)}</p>
            </div>
          ) : null}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{driver.nationality}</p>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-center gap-2">
        <div className="flex h-[64px] w-[56px] flex-col items-center justify-center rounded-md border border-slate-200/85 bg-white/88 px-1.5 text-center shadow-sm backdrop-blur-[1px] dark:border-slate-700/85 dark:bg-slate-900/82">
          <TrendingUp className="mx-auto mb-0.5 size-3 text-slate-500 dark:text-slate-300" />
          <p className="text-sm font-extrabold leading-none text-slate-900 dark:text-slate-100">{driver.points}</p>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] text-slate-600 dark:text-slate-400">Points</p>
        </div>
        <div className="flex h-[64px] w-[56px] flex-col items-center justify-center rounded-md border border-slate-200/85 bg-white/88 px-1.5 text-center shadow-sm backdrop-blur-[1px] dark:border-slate-700/85 dark:bg-slate-900/82">
          <Trophy className="mx-auto mb-0.5 size-3 text-amber-500 dark:text-amber-400" />
          <p className="text-sm font-extrabold leading-none text-slate-900 dark:text-slate-100">{driver.wins}</p>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] text-slate-600 dark:text-slate-400">Wins</p>
        </div>
        <div className="flex h-[64px] w-[56px] flex-col items-center justify-center rounded-md border border-slate-200/85 bg-white/88 px-1.5 text-center shadow-sm backdrop-blur-[1px] dark:border-slate-700/85 dark:bg-slate-900/82">
          <Award className="mx-auto mb-0.5 size-3 text-sky-600 dark:text-sky-400" />
          <p className="text-sm font-extrabold leading-none text-slate-900 dark:text-slate-100">{driver.podiums}</p>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] text-slate-600 dark:text-slate-400">Podiums</p>
        </div>
      </div>

      {driver.championships > 0 && (
        <div className="relative z-10 mt-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Trophy className="size-4 text-yellow-600" />
            <span className="font-semibold text-slate-100">
              {driver.championships}x World Champion
            </span>
          </div>
        </div>
      )}

    </motion.div>
  );
}
