
import { useState, useEffect } from "react";
import { DriverCard } from "./DriverCard";
import { DriverDetailAnalysis } from "./DriverDetailAnalysis";
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

export function DriversSection() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const { searchQuery, selectedTeam, selectedSeason } = useFilters();

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true);
      const response = await api.getDrivers({
        search: searchQuery,
        team: selectedTeam,
        season: selectedSeason,
      });
      if (response.success) {
        setDrivers(response.data);
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Drivers</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Click a driver to view detailed analysis and stats.
        </p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl mx-auto">
            <div className="absolute top-3 right-3 z-10">
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 rounded-full p-1 shadow"
                onClick={handleCloseDetail}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <DriverDetailAnalysis driver={selectedDriver} />
          </div>
        </div>
      )}
    </div>
  );
}