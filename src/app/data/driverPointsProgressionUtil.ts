// Utility to compute driver points progression for a given season from raceResultsById
import { raceCatalog, raceResultsById } from "./raceLapTimes";

export function getDriverPointsProgression(season: string, driverName: string) {
  // Get all races for the season, sorted by date
  const races = raceCatalog.filter(r => r.season === season).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let cumulative = 0;
  const progression = [];
  for (let i = 0; i < races.length; i++) {
    const race = races[i];
    const results = raceResultsById[race.id] || [];
    const entry = results.find(e => e.driverName === driverName);
    if (entry) {
      cumulative += entry.points;
      progression.push({
        raceId: race.id,
        raceName: race.name,
        round: i + 1,
        position: parseInt(entry.positionLabel) || null,
        points: cumulative,
      });
    }
  }
  return progression;
}
