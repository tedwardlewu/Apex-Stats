import { Trophy, Users, Flag, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
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
import * as api from "./services/api";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("2026");
  const [stats, setStats] = useState({
    totalRaces: 0,
    topDriver: "",
    topTeam: "",
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await api.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats from SQL database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
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

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
        />

        <TabNavigation>
          {{
            overview: (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <DriverStandings />
                  </div>
                  <div>
                    <TeamStandings />
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
                  <TeamStandings />
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
            compare: (
              <CompareSection />
            )
          }}
        </TabNavigation>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-600">
            Apex Stats - Formula 1 Analytics Dashboard | 2026 Season Data
          </p>
        </div>
      </footer>
    </div>
  );
}
