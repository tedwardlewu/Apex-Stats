import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Activity, LayoutGrid, BarChart3, Trophy, GitCompare, Newspaper, CalendarDays } from "lucide-react";

interface TabNavigationProps {
  children: {
    overview: React.ReactNode;
    analytics: React.ReactNode;
    standings: React.ReactNode;
    predictions: React.ReactNode;
    compare: React.ReactNode;
    graphs: React.ReactNode;
    news: React.ReactNode;
    calendar: React.ReactNode;
  };
}

export function TabNavigation({ children }: TabNavigationProps) {
  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "standings", label: "Standings", icon: Trophy },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "predictions", label: "Predictions", icon: Activity },
    { key: "graphs", label: "Graphs", icon: BarChart3 },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
    { key: "news", label: "News", icon: Newspaper },
    { key: "compare", label: "Compare", icon: GitCompare },
  ] as const;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8 grid w-full grid-cols-2 gap-2 rounded-xl bg-white/70 p-2 shadow-sm backdrop-blur md:grid-cols-4 xl:grid-cols-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <TabsTrigger key={key} value={key} className="flex items-center gap-2 rounded-xl">
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

      <TabsContent value="predictions">
        {children.predictions}
      </TabsContent>

      <TabsContent value="graphs">
        {children.graphs}
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
    </Tabs>
  );
}
