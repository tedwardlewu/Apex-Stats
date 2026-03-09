import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import * as api from "../services/api";

export function LapTimeChart() {
  const [lapTimeData, setLapTimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch lap times from SQL backend
  useEffect(() => {
    async function fetchLapTimes() {
      try {
        setLoading(true);
        const response = await api.getLapTimes();
        if (response.success) {
          setLapTimeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching lap times from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLapTimes();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-center text-gray-600">Loading lap times from database...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-green-600" />
          <h2 className="text-xl font-bold">Lap Time Analysis</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Average lap times throughout the race (seconds)</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lapTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="lap" 
              label={{ value: 'Lap Number', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }}
              domain={[85, 95]}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="verstappen" 
              stroke="#1E40AF" 
              strokeWidth={2}
              name="Verstappen"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="leclerc" 
              stroke="#DC2626" 
              strokeWidth={2}
              name="Leclerc"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="hamilton" 
              stroke="#06B6D4" 
              strokeWidth={2}
              name="Hamilton"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="norris" 
              stroke="#F97316" 
              strokeWidth={2}
              name="Norris"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}