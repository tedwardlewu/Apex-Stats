import { Search, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFilters } from "../contexts/FilterContext";
import { useMemeify } from "../contexts/MemeifyContext";
import { getTeamDisplayName } from "../utils/teamImages";

const DEFAULT_SEASON = "2026";

export function FilterBar() {
  const { searchQuery, setSearchQuery, selectedTeam, setSelectedTeam, selectedSeason, setSelectedSeason } = useFilters();
  const { memeify } = useMemeify();

  const hasActiveFilters = searchQuery !== "" || selectedTeam !== "all" || selectedSeason !== DEFAULT_SEASON;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTeam("all");
    setSelectedSeason(DEFAULT_SEASON);
  };

  return (
    <div className="mb-6 rounded-[12px] border border-slate-200/70 bg-white/88 px-4 py-3.5 text-slate-900 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/88 dark:text-gray-100">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-red-500 dark:bg-slate-700/80">
            <Filter className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold leading-none">Filters</h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Season, team, driver</p>
          </div>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 rounded-[10px] px-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            <X className="size-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-[10px] border-slate-200 bg-white pl-10 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="h-10 rounded-[10px] border-slate-200 bg-white text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="Ferrari">{getTeamDisplayName("Ferrari", memeify)}</SelectItem>
            <SelectItem value="McLaren">{getTeamDisplayName("McLaren", memeify)}</SelectItem>
            <SelectItem value="Red Bull Racing">{getTeamDisplayName("Red Bull Racing", memeify)}</SelectItem>
            <SelectItem value="Mercedes">{getTeamDisplayName("Mercedes", memeify)}</SelectItem>
            <SelectItem value="Williams">{getTeamDisplayName("Williams", memeify)}</SelectItem>
            <SelectItem value="Aston Martin">{getTeamDisplayName("Aston Martin", memeify)}</SelectItem>
            <SelectItem value="RB">{getTeamDisplayName("RB", memeify)}</SelectItem>
            <SelectItem value="Haas">{getTeamDisplayName("Haas", memeify)}</SelectItem>
            <SelectItem value="Alpine">{getTeamDisplayName("Alpine", memeify)}</SelectItem>
            <SelectItem value="Kick Sauber">{getTeamDisplayName("Kick Sauber", memeify)}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="h-10 rounded-[10px] border-slate-200 bg-white text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="2026 Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025 Season</SelectItem>
            <SelectItem value="2026">2026 Season</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}