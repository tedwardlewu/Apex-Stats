import { useState, useEffect } from "react";
import * as api from "../services/api";

interface Consistency {
  id: number;
  driver: string;
  score: number;
  avgPosition: number;
}

export function ConsistencyTable() {
  const [consistency, setConsistency] = useState<Consistency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsistency() {
      try {
        setLoading(true);
        const response = await api.getConsistency();
        if (response.success) {
          setConsistency(response.data);
        }
      } catch (error) {
        console.error("Error fetching consistency from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConsistency();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-sm p-6">
        <p className="text-center text-gray-300">Loading consistency data from database...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm text-gray-200">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">Driver Consistency Score</h2>
        <p className="text-sm text-gray-600 mt-1">Based on average finish position and performance variance</p>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Rank</th>
                <th className="text-left py-3 px-4 font-semibold">Driver</th>
                <th className="text-left py-3 px-4 font-semibold">Consistency Score</th>
                <th className="text-left py-3 px-4 font-semibold">Avg Position</th>
                <th className="text-left py-3 px-4 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {consistency.map((item, index) => (
                <tr key={item.driver} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-700">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold">{item.driver}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="font-semibold">{item.score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{item.avgPosition.toFixed(1)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.score >= 90 ? 'bg-green-100 text-green-800' :
                      item.score >= 80 ? 'bg-blue-100 text-blue-800' :
                      item.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.score >= 90 ? 'Excellent' :
                       item.score >= 80 ? 'Very Good' :
                       item.score >= 70 ? 'Good' : 'Fair'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}