import { Search, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFilters } from "../contexts/FilterContext";

export function FilterBar() {
  const { searchQuery, setSearchQuery, selectedTeam, setSelectedTeam, selectedSeason, setSelectedSeason } = useFilters();

  const hasActiveFilters = searchQuery !== "" || selectedTeam !== "all" || selectedSeason !== "2026";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTeam("all");
    setSelectedSeason("2026");
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm p-6 mb-8 text-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="size-5 text-gray-600" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="size-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
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
            <SelectItem value="Ferrari">Ferrari</SelectItem>
            <SelectItem value="McLaren">McLaren</SelectItem>
            <SelectItem value="Red Bull Racing">Red Bull Racing</SelectItem>
            <SelectItem value="Mercedes">Mercedes</SelectItem>
            <SelectItem value="Williams">Williams</SelectItem>
            <SelectItem value="Aston Martin">Aston Martin</SelectItem>
            <SelectItem value="RB">RB</SelectItem>
            <SelectItem value="Haas">Haas</SelectItem>
            <SelectItem value="Alpine">Alpine</SelectItem>
            <SelectItem value="Kick Sauber">Kick Sauber</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
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