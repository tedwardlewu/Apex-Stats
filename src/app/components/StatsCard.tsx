import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, color = "text-blue-600" }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-lg bg-slate-100 p-3 dark:bg-gray-700 ${color}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}
