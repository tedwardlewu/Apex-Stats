import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Driver } from "../data/mockData";
import { Trophy, Award, Target, TrendingUp } from "lucide-react";

interface DriverComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver1: Driver | null;
  driver2: Driver | null;
}

export function DriverComparisonModal({
  open,
  onOpenChange,
  driver1,
  driver2
}: DriverComparisonModalProps) {
  if (!driver1 || !driver2) return null;

  const stats = [
    { label: "Points", icon: TrendingUp, key: "points" as const },
    { label: "Wins", icon: Trophy, key: "wins" as const },
    { label: "Podiums", icon: Award, key: "podiums" as const },
    { label: "Championships", icon: Target, key: "championships" as const }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Driver Comparison</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8 mt-6">
          {/* Driver 1 */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {driver1.number}
            </div>
            <h3 className="text-xl font-bold">{driver1.name}</h3>
            <p className="text-sm text-gray-600">{driver1.team}</p>
            <p className="text-xs text-gray-500 mt-1">{driver1.nationality}</p>
          </div>

          {/* Driver 2 */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {driver2.number}
            </div>
            <h3 className="text-xl font-bold">{driver2.name}</h3>
            <p className="text-sm text-gray-600">{driver2.team}</p>
            <p className="text-xs text-gray-500 mt-1">{driver2.nationality}</p>
          </div>
        </div>

        {/* Stats Comparison */}
        <div className="space-y-6 mt-8">
          {stats.map((stat) => {
            const value1 = driver1[stat.key];
            const value2 = driver2[stat.key];
            const max = Math.max(value1, value2);
            const percentage1 = max > 0 ? (value1 / max) * 100 : 0;
            const percentage2 = max > 0 ? (value2 / max) * 100 : 0;

            return (
              <div key={stat.key}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="size-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">{value1}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${percentage1}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">{value2}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${percentage2}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
