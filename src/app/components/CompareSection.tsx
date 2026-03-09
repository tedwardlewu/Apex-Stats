import { useState, useEffect } from "react";
import { DriverCard } from "./DriverCard";
import { Button } from "./ui/button";
import { DriverComparisonModal } from "./DriverComparisonModal";
import { GitCompare, X } from "lucide-react";
import * as api from "../services/api";

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
}

export function CompareSection() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch drivers from SQL backend
  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        const response = await api.getDrivers();
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
  }, []);

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
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitCompare className="size-5 text-blue-600" />
              <h2 className="text-xl font-bold">Compare Drivers</h2>
            </div>
            <p className="text-sm text-gray-600">
              Select 2 drivers to compare their stats ({selectedDrivers.length}/2 selected)
            </p>
          </div>
          <div className="flex gap-2">
            {selectedDrivers.length > 0 && (
              <Button variant="outline" onClick={handleReset}>
                <X className="size-4 mr-2" />
                Reset
              </Button>
            )}
            <Button
              onClick={handleCompare}
              disabled={selectedDrivers.length !== 2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <GitCompare className="size-4 mr-2" />
              Compare
            </Button>
          </div>
        </div>

        {selectedDrivers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-semibold mb-2">Selected:</p>
            <div className="flex gap-2">
              {selectedDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"
                >
                  <span className="font-semibold text-blue-900">{driver.name}</span>
                  <button
                    onClick={() => handleDriverSelect(driver)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="size-4" />
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