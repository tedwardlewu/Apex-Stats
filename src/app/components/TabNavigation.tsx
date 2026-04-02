import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Activity, LayoutGrid, BarChart3, Trophy, GitCompare, Newspaper, CalendarDays, Flag } from "lucide-react";

interface TabNavigationProps {
  value: string;
  onValueChange: (value: string) => void;
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

export function TabNavigation({ value, onValueChange, children }: TabNavigationProps) {
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
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <div>
        <div className="mb-3 flex flex-col gap-1 px-1 sm:px-2">
          <span className="text-[0.95rem] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Dashboard Navigation</span>
          <span className="text-sm text-slate-600 dark:text-slate-300">Fast section switching with a lighter race-control style bar.</span>
        </div>
        <div className="mb-8 rounded-[14px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.76))] p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(15,23,42,0.58))]">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1.5 rounded-[12px] bg-transparent p-0 md:grid-cols-4 xl:grid-cols-8">
          {tabs.map(({ key, label, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="group relative min-h-10 overflow-hidden rounded-[10px] border border-transparent px-2.5 py-2 text-slate-600 transition-all duration-200 hover:bg-white/75 hover:text-slate-900 data-[state=active]:border-slate-200/90 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:text-slate-300 dark:hover:bg-slate-800/75 dark:hover:text-slate-100 dark:data-[state=active]:border-slate-700 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white"
            >
              <span className="absolute inset-x-3 top-0 h-px bg-transparent transition-colors group-data-[state=active]:bg-red-500/80 dark:group-data-[state=active]:bg-red-400/80" />
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100/90 text-slate-500 transition-colors group-hover:bg-slate-200 group-hover:text-slate-700 group-data-[state=active]:bg-slate-900 group-data-[state=active]:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700 dark:group-hover:text-slate-100 dark:group-data-[state=active]:bg-white dark:group-data-[state=active]:text-slate-900">
                <Icon className="size-3.5" />
              </span>
              <span className="text-[13px] font-medium tracking-[0.01em]">{label}</span>
            </TabsTrigger>
          ))}
          </TabsList>
        </div>
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
