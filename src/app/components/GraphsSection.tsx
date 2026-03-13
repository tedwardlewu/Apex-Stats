import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getDriverStats } from "../services/driverStatsApi";

interface DriverStats {
  name: string;
  points: number;
  wins: number;
  podiums: number;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

function buildChartData(driverStats: DriverStats[], label: string, color: string, key: keyof DriverStats) {
  return {
    labels: driverStats.map((driver) => driver.name),
    datasets: [
      {
        label,
        data: driverStats.map((driver) => Number(driver[key])),
        backgroundColor: color,
        borderRadius: 12,
        maxBarThickness: 42,
      },
    ],
  };
}

export function GraphsSection() {
  const [driverStats, setDriverStats] = useState<DriverStats[]>([]);

  useEffect(() => {
    let isMounted = true;

    getDriverStats().then((data) => {
      if (isMounted) {
        setDriverStats(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const chartCards = [
    {
      title: "Driver Points",
      description: "Current points totals across the featured drivers.",
      data: buildChartData(driverStats, "Points", "#2563eb", "points"),
    },
    {
      title: "Driver Wins",
      description: "Win count comparison for the same lineup.",
      data: buildChartData(driverStats, "Wins", "#ea580c", "wins"),
    },
    {
      title: "Driver Podiums",
      description: "Podium consistency at a glance.",
      data: buildChartData(driverStats, "Podiums", "#059669", "podiums"),
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Graphs</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Driver performance snapshot</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Quick chart views for points, wins, and podiums without the empty placeholder panels.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {chartCards.map((chart) => (
          <article key={chart.title} className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{chart.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{chart.description}</p>
            <div className="mt-6 h-72">
              <Bar data={chart.data} options={chartOptions} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
