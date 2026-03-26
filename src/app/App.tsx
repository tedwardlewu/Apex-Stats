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
import { ChampionshipSnapshot } from "./components/ChampionshipSnapshot";
import { GraphsSection } from "./components/GraphsSection";
import { NextRacePrediction } from "./components/NextRacePrediction";
import { RaceResults } from "./components/RaceResults";
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

const driverBackgroundByName: Record<string, string> = {
  "Max Verstappen": "/Driver Images/Max.avif",
  "Isack Hadjar": "/Driver Images/Isack.avif",
  "Charles Leclerc": "/Driver Images/Charles.avif",
  "Lewis Hamilton": "/Driver Images/Lewis.avif",
  "George Russell": "/Driver Images/Russel.avif",
  "Kimi Antonelli": "/Driver Images/Antonelli.avif",
  "Lando Norris": "/Driver Images/Norris.avif",
  "Oscar Piastri": "/Driver Images/Oscar.avif",
  "Fernando Alonso": "/Driver Images/Alonso.avif",
  "Lance Stroll": "/Driver Images/Stroll.avif",
  "Nico Hulkenberg": "/Driver Images/Hulkenburg.avif",
  "Gabriel Bortoleto": "/Driver Images/Borteoleto.avif",
  "Pierre Gasly": "/Driver Images/Gasly.avif",
  "Franco Colapinto": "/Driver Images/Colapinto.avif",
  "Carlos Sainz": "/Driver Images/Sainz.avif",
  "Alexander Albon": "/Driver Images/Albon.avif",
  "Liam Lawson": "/Driver Images/Lawson.avif",
  "Arvid Lindblad": "/Driver Images/Lindblad.avif",
  "Esteban Ocon": "/Driver Images/Ocon.avif",
  "Oliver Bearman": "/Driver Images/Bearman.avif",
  "Sergio Perez": "/Driver Images/Perez.avif",
  "Valtteri Bottas": "/Driver Images/Bottas.avif",
};

const teamBackgroundByName: Record<string, string> = {
  Mercedes: "/Team Images/Mercedes.avif",
  Ferrari: "/Team Images/Ferrari.avif",
  McLaren: "/Team Images/McLaren.avif",
  "Red Bull Racing": "/Team Images/Redbull.avif",
  "Haas F1 Team": "/Team Images/Haas.avif",
  "Racing Bulls": "/Team Images/Racingbulls.avif",
  Audi: "/Team Images/Audi.avif",
  Alpine: "/Team Images/Alpine.avif",
  Williams: "/Team Images/Williams.avif",
  Cadillac: "/Team Images/Cadillac.avif",
  "Aston Martin": "/Team Images/Aston.avif",
  Sauber: "/Team Images/Sauber.avif",
};

export default function App() {
  const [stats, setStats] = useState(initialStats);
  const [topDriverImage, setTopDriverImage] = useState("");
  const [topDriverTeamColor, setTopDriverTeamColor] = useState("#334155");
  const [topTeamImage, setTopTeamImage] = useState("");
  const [topTeamColor, setTopTeamColor] = useState("#334155");
  const { selectedSeason } = useFilters();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [statsResponse, driversResponse, teamsResponse] = await Promise.all([
          api.getStats({ season: selectedSeason }),
          api.getDrivers({ season: selectedSeason }),
          api.getTeams({ season: selectedSeason }),
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (driversResponse.success && driversResponse.data.length > 0) {
          const leader = [...driversResponse.data].sort((a, b) => b.points - a.points)[0];
          const resolvedDriverImage = leader?.name ? driverBackgroundByName[leader.name] ?? leader.image ?? "" : "";
          setTopDriverImage(resolvedDriverImage);

          if (teamsResponse.success) {
            const leaderTeamColor = teamsResponse.data.find((team) => team.name === leader?.team)?.color ?? "#334155";
            setTopDriverTeamColor(leaderTeamColor);
          }
        } else {
          setTopDriverImage("");
          setTopDriverTeamColor("#334155");
        }

        if (teamsResponse.success && teamsResponse.data.length > 0) {
          const leaderTeam = [...teamsResponse.data].sort((a, b) => b.points - a.points)[0];
          const resolvedTeamImage = leaderTeam?.name ? teamBackgroundByName[leaderTeam.name] ?? leaderTeam.image ?? "" : "";
          setTopTeamImage(resolvedTeamImage);
          setTopTeamColor(leaderTeam?.color ?? "#334155");
        } else {
          setTopTeamImage("");
          setTopTeamColor("#334155");
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
            backgroundImage={topDriverImage}
            backgroundVariant="driver"
            backgroundAccentColor={topDriverTeamColor}
          />
          <AnimatedStatsCard
            title="Leading Team"
            value={stats.topTeam}
            icon={Users}
            color="text-blue-600"
            delay={0.2}
            backgroundImage={topTeamImage}
            backgroundVariant="team"
            backgroundAccentColor={topTeamColor}
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
                <ChampionshipSnapshot />

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
                <div className="mt-8">
                  <GraphsSection />
                </div>
              </>
            ),
            results: <RaceResults />,
            predictions: <NextRacePrediction />,
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
