import { useState, useEffect } from "react";
import { DriverCard } from "./DriverCard";
import { DriverDetailAnalysis } from "./DriverDetailAnalysis";
import { DriverQualitiesGrid } from "./DriverQualitiesGrid";
import * as api from "../services/api";
import { useFilters } from "../contexts/FilterContext";

interface Driver {
  id: number;
  name: string;
  number: number;
  team: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
  image: string;
}

export function AnalyticsDriversSection() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const { searchQuery, selectedTeam, selectedSeason } = useFilters();

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true);
      const driversResponse = await api.getDrivers({
        search: searchQuery,
        team: selectedTeam,
        season: selectedSeason,
      });

      if (driversResponse.success) {
        setDrivers(driversResponse.data);
      }
      setLoading(false);
    }
    fetchDrivers();
  }, [searchQuery, selectedTeam, selectedSeason]);

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedDriver(null);
  };

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  return (
    <div className="mb-8">
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Driver Analysis</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Click a driver to view current and past season performance and analysis.
        </p>
        <div className="mb-5">
          <DriverQualitiesGrid />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedDrivers.map((driver, index) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              rank={index + 1}
              onSelect={() => handleDriverClick(driver)}
              showTeam={true}
            />
          ))}
        </div>
      </div>
      {selectedDriver && showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCloseDetail}
        >
          <div
            className="relative w-full max-w-xl mx-auto"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <DriverDetailAnalysis driver={selectedDriver} />
          </div>
        </div>
      )}
    </div>
  );
}
