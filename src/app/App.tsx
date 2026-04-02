import { Trophy, Users, Flag, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { AnimatedStatsCard } from "./components/AnimatedStatsCard";
import { DriverStandings } from "./components/DriverStandings";
import { TeamStandings } from "./components/TeamStandings";
import { LapTimeChart } from "./components/LapTimeChart";
import { TeamPerformanceChart } from "./components/TeamPerformanceChart";
import { GraphsSection } from "./components/GraphsSection";
import { ConsistencyTable } from "./components/ConsistencyTable";
import { RecentRaces } from "./components/RecentRaces";
import { FilterBar } from "./components/FilterBar";
import { TabNavigation } from "./components/TabNavigation";
import { CompareSection } from "./components/CompareSection";
import { ChampionshipSnapshot } from "./components/ChampionshipSnapshot";
import { AnalyticsDriversSection } from "./components/AnalyticsDriversSection";
import { DriverQualitiesGrid } from "./components/DriverQualitiesGrid";
import React from "react";
import { DriverDetailAnalysis } from "./components/DriverDetailAnalysis";
import { NextRacePrediction } from "./components/NextRacePrediction";
import { RaceResults } from "./components/RaceResults";
import { TeamsShowcase } from "./components/TeamsShowcase";
import { NewsSection } from "./components/NewsSection";
import RacingCalendar from "./components/RacingCalendar";
import { TeammateIndex } from "./components/TeammateIndex";
import { useFilters } from "./contexts/FilterContext";
import { useMemeify } from "./contexts/MemeifyContext";
import * as api from "./services/api";
import { getDriverImage } from "./utils/driverImages";

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
  const [activeTab, setActiveTab] = useState("overview");
  const { selectedSeason } = useFilters();
  const { memeify } = useMemeify();

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
          const baseDriverImage = leader?.name ? driverBackgroundByName[leader.name] ?? leader.image ?? "" : "";
          const resolvedDriverImage = leader?.name ? getDriverImage(leader.name, baseDriverImage, memeify) : "";
          setTopDriverImage(resolvedDriverImage);

          if (teamsResponse.success) {
            const leaderTeamColor = teamsResponse.data.find((team) => team.name === leader?.team)?.color ?? "#334155";
            setTopDriverTeamColor(leaderTeamColor);
          }
        } 
        
        else {
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
  }, [selectedSeason, memeify]);

  const scrollToTeamsShowcase = () => {
    document.getElementById("teams-showcase-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAnalyticsSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#e5e7eb_100%)] text-foreground dark:bg-[linear-gradient(180deg,_#111111_0%,_#1b1b1b_100%)]">
      <Header />
      <main className="container mx-auto px-6 py-1 lg:py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-0">
          <AnimatedStatsCard
            title="Total Races"
            value={stats.totalRaces}
            icon={Flag}
            color="text-red-600"
            delay={0}
            backgroundImages={[
              "/Race Backgrounds/Abu Dhabi.jpg",
              "/Race Backgrounds/Australia.webp",
              "/Race Backgrounds/Austria.jpg",
              "/Race Backgrounds/Azerbaijan.jpg",
              "/Race Backgrounds/Bahrain.avif",
              "/Race Backgrounds/Belgian.avif",
              "/Race Backgrounds/Brazil.jpg",
              "/Race Backgrounds/British.jpg",
              "/Race Backgrounds/Canada.jpg",
              "/Race Backgrounds/China.webp",
              "/Race Backgrounds/Dutch.webp",
              "/Race Backgrounds/Hungary.jpg",
              "/Race Backgrounds/Italy.jpg",
              "/Race Backgrounds/Japan.webp",
              "/Race Backgrounds/Mexico.jpg",
              "/Race Backgrounds/Miami.avif",
              "/Race Backgrounds/Monaco.jpg",
              "/Race Backgrounds/Qatar.avif",
              "/Race Backgrounds/Saudi.webp",
              "/Race Backgrounds/Singapore.webp",
              "/Race Backgrounds/Spain.jpg",
              "/Race Backgrounds/US.jpg",
              "/Race Backgrounds/Vegas.webp",
            ]}
            backgroundImageLocations={[
              { circuit: "Yas Marina Circuit", country: "UAE" },
              { circuit: "Albert Park", country: "Australia" },
              { circuit: "Red Bull Ring", country: "Austria" },
              { circuit: "Baku City Circuit", country: "Azerbaijan" },
              { circuit: "Bahrain International Circuit", country: "Bahrain" },
              { circuit: "Circuit de Spa-Francorchamps", country: "Belgium" },
              { circuit: "Interlagos", country: "Brazil" },
              { circuit: "Silverstone", country: "UK" },
              { circuit: "Circuit Gilles Villeneuve", country: "Canada" },
              { circuit: "Shanghai International Circuit", country: "China" },
              { circuit: "Circuit Zandvoort", country: "Netherlands" },
              { circuit: "Hungaroring", country: "Hungary" },
              { circuit: "Monza", country: "Italy" },
              { circuit: "Suzuka", country: "Japan" },
              { circuit: "Autódromo Hermanos Rodríguez", country: "Mexico" },
              { circuit: "Miami International Autodrome", country: "USA" },
              { circuit: "Circuit de Monaco", country: "Monaco" },
              { circuit: "Lusail International Circuit", country: "Qatar" },
              { circuit: "Jeddah Corniche Circuit", country: "Saudi Arabia" },
              { circuit: "Marina Bay Street Circuit", country: "Singapore" },
              { circuit: "Circuit de Barcelona-Catalunya", country: "Spain" },
              { circuit: "Circuit of the Americas", country: "USA" },
              { circuit: "Las Vegas Street Circuit", country: "USA" },
            ]}
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

        <TabNavigation value={activeTab} onValueChange={setActiveTab}>
          {{
            overview: (
              <>
                <FilterBar />
                <ChampionshipSnapshot onViewDetails={() => setActiveTab("standings")} />
                <DriverQualitiesGrid
                  title="Driver qualities"
                  description="Quick read on the strongest, weakest, most consistent, and most reliable performers in the current filtered view."
                  compact
                />
                <div className="mb-8 mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                  <RecentRaces
                    onViewResults={() => setActiveTab("results")}
                    onViewCalendar={() => setActiveTab("calendar")}
                  />
                  <div className="space-y-6">
                    <GraphsSection showHeader={false} overviewMode onViewDetailedAnalysis={() => setActiveTab("analytics")} />
                    <TeammateIndex />
                    <ConsistencyTable compact />
                  </div>
                </div>
              </>
            ),
            standings: (
              <>
                <FilterBar />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <DriverStandings />
                  <TeamStandings onViewCars={scrollToTeamsShowcase} />
                </div>
                <ConsistencyTable />
              </>
            ),
            analytics: (
              <>
                <div id="analytics-top" className="scroll-mt-24" />
                <div className="sticky top-3 z-20 mb-6 rounded-[16px] border border-slate-200/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.94))] px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-700/75 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.97),rgba(15,23,42,0.93))]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Analytics Navigation</p>
                      <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">Jump between analysis blocks</p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      <div className="rounded-[12px] border border-slate-200/80 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                        Quick links
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToAnalyticsSection("analytics-top")}
                        className="rounded-full border border-slate-200/80 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 dark:border-slate-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        Back to top
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => scrollToAnalyticsSection("analytics-pace")}
                      className="rounded-full border border-sky-200/90 bg-sky-50/95 px-4 py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:-translate-y-[1px] hover:border-sky-300 hover:bg-sky-100 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-200 dark:hover:bg-sky-950/45"
                    >
                      Pace
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToAnalyticsSection("analytics-team-performance")}
                      className="rounded-full border border-emerald-200/90 bg-emerald-50/95 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-[1px] hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/45"
                    >
                      Team Form
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToAnalyticsSection("analytics-graphs")}
                      className="rounded-full border border-violet-200/90 bg-violet-50/95 px-4 py-2 text-sm font-semibold text-violet-800 shadow-sm transition hover:-translate-y-[1px] hover:border-violet-300 hover:bg-violet-100 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-200 dark:hover:bg-violet-950/45"
                    >
                      Graphs
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToAnalyticsSection("analytics-consistency")}
                      className="rounded-full border border-amber-200/90 bg-amber-50/95 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm transition hover:-translate-y-[1px] hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/45"
                    >
                      Consistency
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToAnalyticsSection("analytics-teammates")}
                      className="rounded-full border border-rose-200/90 bg-rose-50/95 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm transition hover:-translate-y-[1px] hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200 dark:hover:bg-rose-950/45"
                    >
                      Teammates
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToAnalyticsSection("analytics-driver-analysis")}
                      className="rounded-full border border-cyan-200/90 bg-cyan-50/95 px-4 py-2 text-sm font-semibold text-cyan-800 shadow-sm transition hover:-translate-y-[1px] hover:border-cyan-300 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-200 dark:hover:bg-cyan-950/45"
                    >
                      Driver Analysis
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                  <div id="analytics-pace" className="scroll-mt-24">
                    <LapTimeChart />
                  </div>
                  <div id="analytics-team-performance" className="scroll-mt-24">
                    <TeamPerformanceChart />
                  </div>
                </div>
                <div id="analytics-graphs" className="mt-8 scroll-mt-24">
                  <GraphsSection />
                </div>
                <div id="analytics-consistency" className="mt-8 scroll-mt-24">
                  <ConsistencyTable />
                </div>
                <div id="analytics-teammates" className="mt-8 scroll-mt-24">
                  <TeammateIndex />
                </div>
                <div id="analytics-driver-analysis" className="mt-8 scroll-mt-24">
                  <AnalyticsDriversSection />
                </div>
              </>
            ),
            results: (
              <>
                <FilterBar />
                <RaceResults />
              </>
            ),
            predictions: <NextRacePrediction />,
            calendar: <RacingCalendar />,
            news: <NewsSection />,
            compare: (
              <>
                <FilterBar />
                <CompareSection />
              </>
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
