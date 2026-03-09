import { Flag, TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Flag className="size-8" />
              <div>
                <h1 className="text-2xl font-bold">Apex Stats</h1>
                <p className="text-sm text-red-100">Formula 1 Analytics Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="size-4" />
            <span>2026 Season</span>
          </div>
        </div>
      </div>
    </header>
  );
}
