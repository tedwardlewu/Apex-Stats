import { Driver } from "../data/mockData";
import { Trophy, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface DriverCardProps {
  driver: Driver;
  rank: number;
  isSelected?: boolean;
  onSelect?: (driver: Driver) => void;
}

export function DriverCard({ driver, rank, isSelected, onSelect }: DriverCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      className={`relative bg-white rounded-lg border-2 shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={() => onSelect?.(driver)}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="size-6 text-blue-500" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
            {driver.number}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 border-2 border-white flex items-center justify-center text-xs font-bold">
            {rank}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{driver.name}</h3>
          <p className="text-sm text-gray-600 truncate">{driver.team}</p>
          <p className="text-xs text-gray-500 mt-1">{driver.nationality}</p>
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
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Trophy className="size-4 text-yellow-600" />
            <span className="font-semibold text-gray-700">
              {driver.championships}x World Champion
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
