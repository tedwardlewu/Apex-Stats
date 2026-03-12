import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

interface DriverStats {
  name: string;
  points: number;
  wins: number;
  podiums: number;
}

const GraphsSection: React.FC = () => {
  const [driverStats, setDriverStats] = useState<DriverStats[]>([]);

  useEffect(() => {
    import("../services/driverStatsApi").then(({ getDriverStats }) => {
      getDriverStats().then((data: DriverStats[]) => setDriverStats(data));
    });
  }, []);

  const pointsData = {
    labels: driverStats.map((d) => d.name),
    datasets: [
      {
        label: "Points",
        data: driverStats.map((d) => d.points),
        backgroundColor: "#4F8EF7",
      },
    ],
  };

  const winsData = {
    labels: driverStats.map((d) => d.name),
    datasets: [
      {
        label: "Wins",
        data: driverStats.map((d) => d.wins),
        backgroundColor: "#F76F4F",
      },
    ],
  };

  const podiumsData = {
    labels: driverStats.map((d) => d.name),
    datasets: [
      {
        label: "Podiums",
        data: driverStats.map((d) => d.podiums),
        backgroundColor: "#4FF7A2",
      },
    ],
  };

  return (
    <div>
      <h2>Driver Points</h2>
      <Bar data={pointsData} />
      <h2>Driver Wins</h2>
      <Bar data={winsData} />
      <h2>Driver Podiums</h2>
      <Bar data={podiumsData} />
    </div>
  );
};

export default GraphsSection;
