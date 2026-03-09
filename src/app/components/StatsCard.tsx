import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, color = "text-blue-600" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className={`rounded-lg bg-gray-100 p-3 ${color}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}
