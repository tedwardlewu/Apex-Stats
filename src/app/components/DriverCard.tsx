import { Driver } from "../data/mockData";
import { Trophy, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemeify } from "../contexts/MemeifyContext";
import { getDriverDisplayName, getDriverImage, getDriverImageStyle } from "../utils/driverImages";
import { getTeamDisplayName } from "../utils/teamImages";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      className={`relative cursor-pointer rounded-lg border-2 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/70'
          : 'border-gray-200 dark:border-slate-700'
      }`}
      onClick={() => onSelect?.(driver)}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="size-6 text-blue-500" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {showImage ? (
          <div className="relative">
            <img
              src={getDriverImage(driver.name, driver.image, memeify)}
              alt={displayName}
              className="h-16 w-16 scale-150 rounded-full border-2 border-gray-200 object-cover object-[center_-10%] dark:border-slate-700"
              style={getDriverImageStyle(driver.name, memeify)}
            />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-yellow-500 text-xs font-bold dark:border-slate-900">
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
          {showTeam ? <p className="truncate text-sm text-gray-600 dark:text-slate-300">{getTeamDisplayName(driver.team, memeify)}</p> : null}
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{driver.nationality}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 rounded-lg bg-blue-50">
          <TrendingUp className="size-4 text-blue-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-blue-900">{driver.points}</p>
          <p className="text-xs text-blue-700">Points</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-yellow-50">
          <Trophy className="size-4 text-yellow-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-yellow-900">{driver.wins}</p>
          <p className="text-xs text-yellow-700">Wins</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-purple-50">
          <Award className="size-4 text-purple-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-purple-900">{driver.podiums}</p>
          <p className="text-xs text-purple-700">Podiums</p>
        </div>
      </div>

      {driver.championships > 0 && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Trophy className="size-4 text-yellow-600" />
            <span className="font-semibold text-gray-700 dark:text-slate-200">
              {driver.championships}x World Champion
            </span>
          </div>
        </div>
      )}

    </motion.div>
  );
}
