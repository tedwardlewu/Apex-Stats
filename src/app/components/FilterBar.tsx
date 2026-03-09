import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTeam: string;
  onTeamChange: (value: string) => void;
  selectedSeason: string;
  onSeasonChange: (value: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedTeam,
  onTeamChange,
  selectedSeason,
  onSeasonChange
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-5 text-gray-600" />
        <h2 className="font-semibold">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedTeam} onValueChange={onTeamChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="Ferrari">Ferrari</SelectItem>
            <SelectItem value="McLaren">McLaren</SelectItem>
            <SelectItem value="Red Bull Racing">Red Bull Racing</SelectItem>
            <SelectItem value="Mercedes">Mercedes</SelectItem>
            <SelectItem value="Williams">Williams</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSeason} onValueChange={onSeasonChange}>
          <SelectTrigger>
            <SelectValue placeholder="2026 Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026 Season</SelectItem>
            <SelectItem value="2025">2025 Season</SelectItem>
            <SelectItem value="2024">2024 Season</SelectItem>
            <SelectItem value="2023">2023 Season</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}