import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Driver } from "../data/mockData";
import { Trophy, Award, Target, TrendingUp, Crown } from "lucide-react";
import { useMemeify } from "../contexts/MemeifyContext";
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
  "Haas F1 Team": "#b5b5b5",
  "Racing Bulls": "#7594c2",
};

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
  const { memeify } = useMemeify();

  if (!driver1 || !driver2) return null;

  const stats = [
    { label: "Points", icon: TrendingUp, key: "points" as const },
    { label: "Wins", icon: Trophy, key: "wins" as const },
    { label: "Podiums", icon: Award, key: "podiums" as const },
    { label: "Championships", icon: Target, key: "championships" as const }
  ];

  const leftColor = TEAM_COLORS[driver1.team] ?? "#3b82f6";
  const rightColor = TEAM_COLORS[driver2.team] ?? "#ef4444";

  const leftLeads = stats.filter((stat) => driver1[stat.key] > driver2[stat.key]).length;
  const rightLeads = stats.filter((stat) => driver2[stat.key] > driver1[stat.key]).length;
  const leaderName =
    leftLeads === rightLeads ? null : leftLeads > rightLeads ? driver1.name : driver2.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden border border-slate-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-900">
        <div
          className="h-2"
          style={{ background: `linear-gradient(to right, ${leftColor}, ${rightColor})` }}
        />

        <DialogHeader className="px-6 pb-0 pt-6">
          <DialogTitle className="text-center text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Driver Face-Off
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-center">
              <div className="relative mx-auto mb-3 h-24 w-24">
                <img
                  src={driver1.image}
                  alt={driver1.name}
                  className="h-full w-full rounded-full border-4 object-cover object-[center_-10%]"
                  style={{ borderColor: leftColor }}
                />
                <div
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white dark:border-gray-900"
                  style={{ backgroundColor: leftColor }}
                >
                  {driver1.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{driver1.name}</h3>
              <p className="text-sm font-semibold" style={{ color: leftColor }}>{getTeamDisplayName(driver1.team, memeify)}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{driver1.nationality}</p>
            </div>

            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black tracking-wider text-white dark:bg-gray-700">
              VS
            </div>

            <div className="text-center">
              <div className="relative mx-auto mb-3 h-24 w-24">
                <img
                  src={driver2.image}
                  alt={driver2.name}
                  className="h-full w-full rounded-full border-4 object-cover object-[center_-10%]"
                  style={{ borderColor: rightColor }}
                />
                <div
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white dark:border-gray-900"
                  style={{ backgroundColor: rightColor }}
                >
                  {driver2.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{driver2.name}</h3>
              <p className="text-sm font-semibold" style={{ color: rightColor }}>{getTeamDisplayName(driver2.team, memeify)}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{driver2.nationality}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-gray-700 dark:bg-gray-800">
            {leaderName ? (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-gray-200">
                <Crown className="size-4 text-amber-500" />
                {leaderName} leads this matchup ({leftLeads} - {rightLeads})
              </div>
            ) : (
              <span className="text-sm font-semibold text-slate-600 dark:text-gray-300">Dead heat so far ({leftLeads} - {rightLeads})</span>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {stats.map((stat) => {
              const value1 = driver1[stat.key];
              const value2 = driver2[stat.key];
              const total = value1 + value2;
              const leftWidth = total > 0 ? (value1 / total) * 100 : 50;
              const rightWidth = total > 0 ? (value2 / total) * 100 : 50;
              const leftBetter = value1 > value2;
              const rightBetter = value2 > value1;

              return (
                <div key={stat.key} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/70">
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <stat.icon className="size-4 text-slate-500 dark:text-gray-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-300">
                      {stat.label}
                    </span>
                  </div>

                  <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="text-right">
                      <span className={`text-3xl font-black ${leftBetter ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-gray-600"}`}>
                        {value1}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-400">|</div>
                    <div className="text-left">
                      <span className={`text-3xl font-black ${rightBetter ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-gray-600"}`}>
                        {value2}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-gray-700">
                    <div
                      className="transition-all duration-500"
                      style={{ width: `${leftWidth}%`, backgroundColor: leftColor }}
                    />
                    <div
                      className="transition-all duration-500"
                      style={{ width: `${rightWidth}%`, backgroundColor: rightColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
