import { useState, useEffect } from "react";
import { DriverCard } from "./DriverCard";
import { Button } from "./ui/button";
import { DriverComparisonModal } from "./DriverComparisonModal";
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

export function CompareSection() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const { searchQuery, selectedTeam, selectedSeason } = useFilters();

  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        const response = await api.getDrivers({
          search: searchQuery,
          team: selectedTeam,
          season: selectedSeason,
        });
        if (response.success) {
          setDrivers(response.data);
        }
      } catch (error) {
        console.error("Error fetching drivers from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, [searchQuery, selectedTeam, selectedSeason]);

  useEffect(() => {
    setSelectedDrivers((current) => current.filter((driver) => drivers.some((candidate) => candidate.id === driver.id)));
  }, [drivers]);

  const handleDriverSelect = (driver: Driver) => {
    if (selectedDrivers.find(d => d.id === driver.id)) {
      setSelectedDrivers(selectedDrivers.filter(d => d.id !== driver.id));
    } else if (selectedDrivers.length < 2) {
      setSelectedDrivers([...selectedDrivers, driver]);
    }
  };

  const handleCompare = () => {
    if (selectedDrivers.length === 2) {
      setShowComparison(true);
    }
  };

  const handleReset = () => {
    setSelectedDrivers([]);
    setShowComparison(false);
  };

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  return (
    <div>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Compare Drivers</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Select 2 drivers to compare their stats ({selectedDrivers.length}/2 selected)
            </p>
          </div>
          <div className="flex gap-2">
            {selectedDrivers.length > 0 && (
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
            <Button
              onClick={handleCompare}
              disabled={selectedDrivers.length !== 2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Compare
            </Button>
          </div>
        </div>

        {selectedDrivers.length > 0 && (
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Selected:</p>
            <div className="flex gap-2">
              {selectedDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/30"
                >
                  <span className="font-semibold text-blue-900 dark:text-blue-200">{driver.name}</span>
                  <button
                    onClick={() => handleDriverSelect(driver)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedDrivers.map((driver, index) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            rank={index + 1}
            isSelected={selectedDrivers.some(d => d.id === driver.id)}
            onSelect={handleDriverSelect}
            showTeam={false}
          />
        ))}
      </div>

      <DriverComparisonModal
        open={showComparison}
        onOpenChange={setShowComparison}
        driver1={selectedDrivers[0] || null}
        driver2={selectedDrivers[1] || null}
      />
    </div>
  );
}