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
    <div className="mb-8 rounded-[12px] border border-slate-200/70 bg-white/85 p-6 text-slate-900 backdrop-blur dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="size-5 text-red-500" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            <X className="size-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger>
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
          <SelectTrigger>
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