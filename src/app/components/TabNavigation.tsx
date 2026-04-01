import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Activity, LayoutGrid, BarChart3, Trophy, GitCompare, Newspaper, CalendarDays, Flag } from "lucide-react";

interface TabNavigationProps {
  children: {
    overview: React.ReactNode;
    analytics: React.ReactNode;
    standings: React.ReactNode;
    predictions: React.ReactNode;
    results: React.ReactNode;
    compare: React.ReactNode;
    news: React.ReactNode;
    calendar: React.ReactNode;
  };
}

export function TabNavigation({ children }: TabNavigationProps) {
  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "standings", label: "Standings", icon: Trophy },
    { key: "results", label: "Results", icon: Flag },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "predictions", label: "Predictions", icon: Activity },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
    { key: "news", label: "News", icon: Newspaper },
    { key: "compare", label: "Compare", icon: GitCompare },
  ] as const;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div>
        <div className="flex items-center gap-2 mb-2 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Navigation</span>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">(Use the bar below to switch sections)</span>
        </div>
        <TabsList className="mb-8 grid w-full grid-cols-2 gap-2 rounded-2xl border border-slate-200/80 bg-white/85 p-2 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 md:grid-cols-4 xl:grid-cols-8">
          {tabs.map(({ key, label, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-2 rounded-xl text-slate-600 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:border-slate-700 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white"
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          {children.overview}
        </TabsContent>
        <TabsContent value="standings">
          {children.standings}
        </TabsContent>
        <TabsContent value="analytics">
          {children.analytics}
        </TabsContent>
        <TabsContent value="results">
          {children.results}
        </TabsContent>
        <TabsContent value="predictions">
          {children.predictions}
        </TabsContent>
        <TabsContent value="news">
          {children.news}
        </TabsContent>
        <TabsContent value="compare">
          {children.compare}
        </TabsContent>
        <TabsContent value="calendar">
          {children.calendar}
        </TabsContent>
      </div>
    </Tabs>
  );
}
