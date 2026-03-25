import { Trophy, Users, Flag, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { AnimatedStatsCard } from "./components/AnimatedStatsCard";
import { DriverStandings } from "./components/DriverStandings";
import { TeamStandings } from "./components/TeamStandings";
import { LapTimeChart } from "./components/LapTimeChart";
import { TeamPerformanceChart } from "./components/TeamPerformanceChart";
import { ConsistencyTable } from "./components/ConsistencyTable";
import { RecentRaces } from "./components/RecentRaces";
import { FilterBar } from "./components/FilterBar";
import { TabNavigation } from "./components/TabNavigation";
import { CompareSection } from "./components/CompareSection";
import { GraphsSection } from "./components/GraphsSection";
import { NextRacePrediction } from "./components/NextRacePrediction";
import { TeamsSection } from "./components/TeamsSection";
import { TeamsShowcase } from "./components/TeamsShowcase";
import { NewsSection } from "./components/NewsSection";
import RacingCalendar from "./components/RacingCalendar";
import { useFilters } from "./contexts/FilterContext";
import * as api from "./services/api";

const initialStats = {
  totalRaces: 0,
  topDriver: "",
  topTeam: "",
  totalPoints: 0,
};

export default function App() {
  const [stats, setStats] = useState(initialStats);
  const { selectedSeason } = useFilters();

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.getStats({ season: selectedSeason });
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats from SQL database:", error);
      }
    }

    fetchStats();
  }, [selectedSeason]);

  const scrollToTeamsShowcase = () => {
    document.getElementById("teams-showcase-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.14),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#edf4fb_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.18),_transparent_32%),linear-gradient(180deg,_#0f1723_0%,_#182230_100%)]">
      <Header />
      <main className="container mx-auto px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedStatsCard
            title="Total Races"
            value={stats.totalRaces}
            icon={Flag}
            color="text-red-600"
            delay={0}
          />
          <AnimatedStatsCard
            title="Leading Driver"
            value={stats.topDriver}
            icon={Trophy}
            color="text-yellow-600"
            delay={0.1}
          />
          <AnimatedStatsCard
            title="Leading Team"
            value={stats.topTeam}
            icon={Users}
            color="text-blue-600"
            delay={0.2}
          />
          <AnimatedStatsCard
            title="Total Points"
            value={stats.totalPoints}
            icon={TrendingUp}
            color="text-green-600"
            delay={0.3}
          />
        </div>

        <FilterBar />

        <TabNavigation>
          {{
            overview: (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <DriverStandings />
                  </div>
                  <div>
                    <TeamStandings onViewCars={scrollToTeamsShowcase} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentRaces />
                  <TeamPerformanceChart />
                </div>
              </>
            ),
            standings: (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <DriverStandings />
                  <TeamStandings onViewCars={scrollToTeamsShowcase} />
                </div>
                <ConsistencyTable />
              </>
            ),
            analytics: (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <LapTimeChart />
                  <TeamPerformanceChart />
                </div>
                <ConsistencyTable />
              </>
            ),
            predictions: <NextRacePrediction />,
            graphs: <GraphsSection />,
            calendar: <RacingCalendar />,
            news: <NewsSection />,
            compare: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompareSection />
                <TeamsSection />
              </div>
            )
          }}
        </TabNavigation>
      </main>
      <TeamsShowcase />

      <footer className="mt-12 border-t border-slate-200/70 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-gray-400">
            Apex Stats - Formula 1 Analytics Dashboard | 2026 Season Data
          </p>
        </div>
      </footer>
    </div>
  );
}
