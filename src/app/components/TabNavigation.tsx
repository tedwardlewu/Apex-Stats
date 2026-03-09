import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { LayoutGrid, BarChart3, Trophy, GitCompare } from "lucide-react";

interface TabNavigationProps {
  children: {
    overview: React.ReactNode;
    analytics: React.ReactNode;
    standings: React.ReactNode;
    compare: React.ReactNode;
  };
}

export function TabNavigation({ children }: TabNavigationProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutGrid className="size-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="standings" className="flex items-center gap-2">
          <Trophy className="size-4" />
          <span className="hidden sm:inline">Standings</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="size-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="compare" className="flex items-center gap-2">
          <GitCompare className="size-4" />
          <span className="hidden sm:inline">Compare</span>
        </TabsTrigger>
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

      <TabsContent value="compare">
        {children.compare}
      </TabsContent>
    </Tabs>
  );
}
