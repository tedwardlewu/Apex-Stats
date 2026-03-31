import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  selectedSeason: string;
  setSelectedSeason: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);


// Default to most recent race (Japan, id: 203 for 2025, 103 for 2026)
const DEFAULT_RACE_BY_SEASON: Record<string, number> = {
  "2025": 203,
  "2026": 103,
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("2026");
  // Add selectedRaceId to context for lap time analysis
  const [selectedRaceId, setSelectedRaceId] = useState(DEFAULT_RACE_BY_SEASON["2026"]);

  // When season changes, update selectedRaceId to the most recent race for that season
  function handleSetSelectedSeason(season: string) {
    setSelectedSeason(season);
    setSelectedRaceId(DEFAULT_RACE_BY_SEASON[season] ?? null);
  }

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedTeam,
        setSelectedTeam,
        selectedSeason,
        setSelectedSeason: handleSetSelectedSeason,
        selectedRaceId,
        setSelectedRaceId,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
