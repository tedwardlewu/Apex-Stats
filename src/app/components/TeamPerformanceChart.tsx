import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import * as api from "../services/api";

export function TeamPerformanceChart() {
  const [teamPerformanceData, setTeamPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamPerformance() {
      try {
        setLoading(true);
        const response = await api.getTeamPerformance();
        if (response.success) {
          setTeamPerformanceData(response.data);
        }
      } catch (error) {
        console.error("Error fetching team performance from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamPerformance();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-center text-gray-600">Loading team performance from database...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-purple-600" />
          <h2 className="text-xl font-bold">Team Performance Trends</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Points scored by season</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={teamPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="redBull" fill="#1E40AF" name="Red Bull Racing" />
            <Bar dataKey="ferrari" fill="#DC2626" name="Ferrari" />
            <Bar dataKey="mercedes" fill="#06B6D4" name="Mercedes" />
            <Bar dataKey="mclaren" fill="#F97316" name="McLaren" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}