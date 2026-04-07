import { z } from "zod";
import { raceBestLapTimes, raceCatalog, raceResultsById } from "../data/raceLapTimes";
import {
  consistencyRowArraySchema,
  createSuccessResponseSchema,
  driverArraySchema,
  driverBestLapArraySchema,
  driverSchema,
  raceMetadataArraySchema,
  raceMetadataSchema,
  raceResultEntryArraySchema,
  statsSummarySchema,
  teamArraySchema,
  type Driver,
  type Team,
} from "../data/schemas";

type DriverFilters = { team?: string; search?: string; season?: string };

const DEFAULT_SEASON = "2026";
const DEFAULT_DEBUT_SEASON = 2026;

const driverResponseSchema = createSuccessResponseSchema(driverArraySchema);
const driverDetailResponseSchema = createSuccessResponseSchema(driverSchema);
const teamResponseSchema = createSuccessResponseSchema(teamArraySchema);
const raceResponseSchema = createSuccessResponseSchema(raceMetadataArraySchema);
const bestLapResponseSchema = createSuccessResponseSchema(driverBestLapArraySchema);
const raceResultsResponseSchema = createSuccessResponseSchema(
  z.object({
    race: raceMetadataSchema.nullable(),
    results: raceResultEntryArraySchema,
  })
);
const statsResponseSchema = createSuccessResponseSchema(statsSummarySchema);
const consistencyResponseSchema = createSuccessResponseSchema(consistencyRowArraySchema);

const DRIVER_DEBUT_SEASONS: Record<string, number> = {
  "Max Verstappen": 2015,
  "Isack Hadjar": 2025,
  "Charles Leclerc": 2018,
  "Lewis Hamilton": 2007,
  "George Russell": 2019,
  "Kimi Antonelli": 2025,
  "Lando Norris": 2019,
  "Oscar Piastri": 2023,
  "Fernando Alonso": 2001,
  "Lance Stroll": 2017,
  "Nico Hulkenberg": 2010,
  "Gabriel Bortoleto": 2025,
  "Pierre Gasly": 2018,
  "Franco Colapinto": 2025,
  "Carlos Sainz": 2015,
  "Carlos Sainz Jr.": 2015,
  "Alexander Albon": 2019,
  "Liam Lawson": 2023,
  "Arvid Lindblad": 2026,
  "Esteban Ocon": 2016,
  "Oliver Bearman": 2024,
  "Sergio Perez": 2011,
  "Valtteri Bottas": 2013,
  "Yuki Tsunoda": 2021,
  "Jack Doohan": 2025,
};

function withDriverExperience<T extends { name: string }>(drivers: T[]) {
  return driverArraySchema.parse(drivers.map((driver) => ({
    ...driver,
    debutSeason: DRIVER_DEBUT_SEASONS[driver.name] ?? DEFAULT_DEBUT_SEASON,
  })));
}

const mockDrivers2026 = driverArraySchema.parse([
    { id: 1, name: "Max Verstappen", number: 3, team: "Red Bull Racing", nationality: "Netherlands", age: 28, points: 12, wins: 0, podiums: 0, championships: 3, image: "/Driver Images/Max.avif" },
    { id: 2, name: "Isack Hadjar", number: 20, team: "Red Bull Racing", nationality: "France", age: 21, points: 4, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Isack.avif" },
    { id: 3, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", age: 28, points: 49, wins: 0, podiums: 2, championships: 0, image: "/Driver Images/Charles.avif" },
    { id: 4, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "Great Britain", age: 41, points: 41, wins: 0, podiums: 1, championships: 7, image: "/Driver Images/Lewis.avif" },
    { id: 5, name: "George Russell", number: 63, team: "Mercedes", nationality: "Great Britain", age: 28, points: 63, wins: 1, podiums: 2, championships: 0, image: "/Driver Images/Russel.avif" },
    { id: 6, name: "Kimi Antonelli", number: 7, team: "Mercedes", nationality: "Italy", age: 19, points: 72, wins: 2, podiums: 3, championships: 0, image: "/Driver Images/Antonelli.avif" },
    { id: 7, name: "Lando Norris", number: 1, team: "McLaren", nationality: "Great Britain", age: 26, points: 25, wins: 0, podiums: 0, championships: 1, image: "/Driver Images/Norris.avif" },
    { id: 8, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", age: 25, points: 21, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Oscar.avif" },
    { id: 9, name: "Fernando Alonso", number: 14, team: "Aston Martin", nationality: "Spain", age: 44, points: 0, wins: 0, podiums: 0, championships: 2, image: "/Driver Images/Alonso.avif" },
    { id: 10, name: "Lance Stroll", number: 18, team: "Aston Martin", nationality: "Canada", age: 27, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Stroll.avif" },
    { id: 11, name: "Nico Hulkenberg", number: 27, team: "Audi", nationality: "Germany", age: 38, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Hulkenburg.avif" },
    { id: 12, name: "Gabriel Bortoleto", number: 21, team: "Audi", nationality: "Brazil", age: 22, points: 2, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Borteoleto.avif" },
    { id: 13, name: "Pierre Gasly", number: 10, team: "Alpine", nationality: "France", age: 30, points: 15, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Gasly.avif" },
    { id: 14, name: "Franco Colapinto", number: 24, team: "Alpine", nationality: "Argentina", age: 23, points: 1, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Colapinto.avif" },
    { id: 15, name: "Carlos Sainz", number: 55, team: "Williams", nationality: "Spain", age: 31, points: 2, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Sainz.avif" },
    { id: 16, name: "Alexander Albon", number: 23, team: "Williams", nationality: "Thailand", age: 30, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Albon.avif" },
    { id: 17, name: "Liam Lawson", number: 40, team: "Racing Bulls", nationality: "New Zealand", age: 24, points: 10, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Lawson.avif" },
    { id: 18, name: "Arvid Lindblad", number: 46, team: "Racing Bulls", nationality: "United Kingdom", age: 18, points: 4, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Lindblad.avif" },
    { id: 19, name: "Esteban Ocon", number: 31, team: "Haas F1 Team", nationality: "France", age: 29, points: 1, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Ocon.avif" },
    { id: 20, name: "Oliver Bearman", number: 50, team: "Haas F1 Team", nationality: "United Kingdom", age: 20, points: 17, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Bearman.avif" },
    { id: 21, name: "Sergio Perez", number: 11, team: "Cadillac", nationality: "Mexico", age: 36, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Perez.avif" },
    { id: 22, name: "Valtteri Bottas", number: 77, team: "Cadillac", nationality: "Finland", age: 36, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Bottas.avif" },
]);

const mockDrivers2025 = driverArraySchema.parse([
  { id: 101, name: "Lando Norris", number: 4, team: "McLaren", nationality: "United Kingdom", age: 26, points: 423, wins: 7, podiums: 16, championships: 0, image: "/Drivers 2025/Lando.avif" },
  { id: 102, name: "Max Verstappen", number: 1, team: "Red Bull Racing", nationality: "Netherlands", age: 28, points: 421, wins: 8, podiums: 14, championships: 4, image: "/Drivers 2025/Max.avif" },
  { id: 103, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", age: 25, points: 410, wins: 7, podiums: 13, championships: 0, image: "/Drivers 2025/Oscar.avif" },
  { id: 104, name: "George Russell", number: 63, team: "Mercedes", nationality: "United Kingdom", age: 28, points: 319, wins: 2, podiums: 8, championships: 0, image: "/Drivers 2025/George.avif" },
  { id: 105, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", age: 28, points: 242, wins: 0, podiums: 6, championships: 0, image: "/Drivers 2025/Charles.avif" },
  { id: 106, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "United Kingdom", age: 41, points: 156, wins: 0, podiums: 2, championships: 7, image: "/Drivers 2025/Lewis.avif" },
  { id: 107, name: "Kimi Antonelli", number: 12, team: "Mercedes", nationality: "Italy", age: 19, points: 150, wins: 0, podiums: 2, championships: 0, image: "/Drivers 2025/Kimi.avif" },
  { id: 108, name: "Alexander Albon", number: 23, team: "Williams", nationality: "Thailand", age: 30, points: 73, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Albon.avif" },
  { id: 109, name: "Carlos Sainz Jr.", number: 55, team: "Williams", nationality: "Spain", age: 31, points: 64, wins: 0, podiums: 1, championships: 0, image: "/Drivers 2025/Sainz.avif" },
  { id: 110, name: "Fernando Alonso", number: 14, team: "Aston Martin", nationality: "Spain", age: 44, points: 56, wins: 0, podiums: 0, championships: 2, image: "/Drivers 2025/Alonso.avif" },
  { id: 111, name: "Nico Hulkenberg", number: 27, team: "Sauber", nationality: "Germany", age: 38, points: 51, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Nico.avif" },
  { id: 112, name: "Isack Hadjar", number: 6, team: "Racing Bulls", nationality: "France", age: 21, points: 51, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Isack.avif" },
  { id: 113, name: "Oliver Bearman", number: 87, team: "Haas F1 Team", nationality: "United Kingdom", age: 20, points: 41, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Bearman.avif" },
  { id: 114, name: "Liam Lawson", number: 30, team: "Racing Bulls", nationality: "New Zealand", age: 24, points: 38, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Lawson.avif" },
  { id: 115, name: "Esteban Ocon", number: 31, team: "Haas F1 Team", nationality: "France", age: 29, points: 38, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Ocon.avif" },
  { id: 116, name: "Lance Stroll", number: 18, team: "Aston Martin", nationality: "Canada", age: 27, points: 33, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Stroll.avif" },
  { id: 117, name: "Yuki Tsunoda", number: 22, team: "Red Bull Racing", nationality: "Japan", age: 25, points: 33, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Yuki.avif" },
  { id: 118, name: "Pierre Gasly", number: 10, team: "Alpine", nationality: "France", age: 30, points: 22, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Pierre.avif" },
  { id: 119, name: "Gabriel Bortoleto", number: 5, team: "Sauber", nationality: "Brazil", age: 22, points: 19, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Gabriel.avif" },
  { id: 120, name: "Franco Colapinto", number: 43, team: "Alpine", nationality: "Argentina", age: 23, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Colapinto.avif" },
  { id: 121, name: "Jack Doohan", number: 7, team: "Alpine", nationality: "Australia", age: 22, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Drivers 2025/Jack.avif" },
]);

const mockTeams2026 = teamArraySchema.parse([
  { id: 1, name: "Mercedes", color: "#06B6D4", points: 135, wins: 3, podiums: 5, championships: 8, image: "/Team Images/Mercedes.avif" },
  { id: 2, name: "Ferrari", color: "#DC2626", points: 90, wins: 0, podiums: 3, championships: 16, image: "/Team Images/Ferrari.avif" },
  { id: 3, name: "McLaren", color: "#F97316", points: 46, wins: 0, podiums: 1, championships: 10, image: "/Team Images/McLaren.avif" },
  { id: 4, name: "Red Bull Racing", color: "#1c46ce", points: 16, wins: 0, podiums: 0, championships: 14, image: "/Team Images/Redbull.avif" },
  { id: 5, name: "Haas F1 Team", color: "#f7f5f5", points: 18, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Haas.avif" },
  { id: 6, name: "Racing Bulls", color: "#7594c2", points: 14, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Racingbulls.avif" },
  { id: 7, name: "Audi", color: "#771716", points: 2, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Audi.avif" },
  { id: 8, name: "Alpine", color: "#2871cb", points: 16, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Alpine.avif" },
  { id: 9, name: "Williams", color: "#104fb4", points: 2, wins: 0, podiums: 0, championships: 16, image: "/Team Images/Williams.avif" },
  { id: 10, name: "Cadillac", color: "#444749", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Cadillac.avif" },
  { id: 11, name: "Aston Martin", color: "#10853b", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Aston.avif" },
]);

const mockTeams2025 = teamArraySchema.parse([
  { id: 101, name: "McLaren", color: "#F97316", points: 833, wins: 10, podiums: 29, championships: 8, image: "/Team Images/McLaren.avif" },
  { id: 102, name: "Mercedes", color: "#06B6D4", points: 469, wins: 2, podiums: 10, championships: 8, image: "/Team Images/Mercedes.avif" },
  { id: 103, name: "Red Bull Racing", color: "#1c46ce", points: 451, wins: 8, podiums: 14, championships: 6, image: "/Team Images/Redbull.avif" },
  { id: 104, name: "Ferrari", color: "#DC2626", points: 398, wins: 0, podiums: 8, championships: 16, image: "/Team Images/Ferrari.avif" },
  { id: 105, name: "Williams", color: "#104fb4", points: 137, wins: 0, podiums: 1, championships: 9, image: "/Team Images/Williams.avif" },
  { id: 106, name: "Racing Bulls", color: "#7594c2", points: 92, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Racingbulls.avif" },
  { id: 107, name: "Aston Martin", color: "#10853b", points: 89, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Aston.avif" },
  { id: 108, name: "Haas F1 Team", color: "#f7f5f5", points: 79, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Haas.avif" },
  { id: 109, name: "Sauber", color: "#39FF14", points: 70, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Sauber.avif" },
  { id: 110, name: "Alpine", color: "#2871cb", points: 22, wins: 0, podiums: 0, championships: 2, image: "/Team Images/Alpine.avif" },
]);

const legacyTotalPointsBySeason: Record<string, number> = {
  "2025": 1673,
};

const teamAliases: Record<string, string[]> = {
  "Red Bull Racing": ["Red Bull Racing"],
  "Ferrari": ["Ferrari"],
  "McLaren": ["McLaren"],
  "Mercedes": ["Mercedes"],
  "Williams": ["Williams"],
  "Aston Martin": ["Aston Martin"],
  "RB": ["RB", "Racing Bulls"],
  "Racing Bulls": ["Racing Bulls"],
  "Haas": ["Haas", "Haas F1 Team"],
  "Haas F1 Team": ["Haas F1 Team"],
  "Alpine": ["Alpine"],
  "Kick Sauber": ["Kick Sauber", "Audi", "Sauber"],
  "Sauber": ["Sauber", "Kick Sauber", "Audi"],
  "Audi": ["Audi", "Kick Sauber", "Sauber"],
  "Cadillac": ["Cadillac"],
};

export async function getDrivers(filters?: DriverFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const baseDrivers = withDriverExperience(season === "2025" ? mockDrivers2025 : mockDrivers2026);
  const searchTerm = filters?.search?.trim().toLowerCase();

  let filteredDrivers = [...baseDrivers];

  if (filters?.team && filters.team !== "all") {
    const teamsToMatch = teamAliases[filters.team] ?? [filters.team];
    filteredDrivers = filteredDrivers.filter(d => teamsToMatch.includes(d.team));
  }

  if (searchTerm) {
    filteredDrivers = filteredDrivers.filter(d =>
      d.name.toLowerCase().includes(searchTerm)
    );
  }

  filteredDrivers.sort((a, b) => b.points - a.points);

  return driverResponseSchema.parse({ success: true, data: filteredDrivers });
}

export async function getDriverById(id: number) {
  const mockDrivers = driverArraySchema.parse([
    { id: 1, name: "Max Verstappen", number: 1, team: "Red Bull Racing", nationality: "Netherlands", points: 198, wins: 2, podiums: 8, championships: 3 },
    { id: 2, name: "Sergio Perez", number: 11, team: "Red Bull Racing", nationality: "Mexico", points: 142, wins: 0, podiums: 4, championships: 0 },
    { id: 3, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "Great Britain", points: 276, wins: 4, podiums: 10, championships: 7 },
    { id: 4, name: "George Russell", number: 63, team: "Mercedes", nationality: "Great Britain", points: 187, wins: 1, podiums: 7, championships: 0 },
    { id: 5, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", points: 312, wins: 5, podiums: 12, championships: 0 },
    { id: 6, name: "Carlos Sainz", number: 55, team: "Williams", nationality: "Spain", points: 156, wins: 1, podiums: 5, championships: 0 },
    { id: 7, name: "Lando Norris", number: 4, team: "McLaren", nationality: "Great Britain", points: 224, wins: 3, podiums: 9, championships: 0 },
    { id: 8, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", points: 178, wins: 2, podiums: 6, championships: 0 },
  ]);

  const driver = mockDrivers.find((entry: Driver) => entry.id === id);
  if (!driver) {
    return { success: false, error: "Driver not found" };
  }

  return driverDetailResponseSchema.parse({ success: true, data: driver });
}

type TeamFilters = { season?: string };

export async function getTeams(filters?: TeamFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;

  return teamResponseSchema.parse({ success: true, data: season === "2025" ? mockTeams2025 : mockTeams2026 });
}

type RaceFilters = { season?: string };

export async function getRaces(filters?: RaceFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const races = raceMetadataArraySchema.parse(raceCatalog
    .filter((race) => race.season === season)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

  return raceResponseSchema.parse({ success: true, data: races });
}

type LapTimeFilters = { season?: string; raceId?: number };

type RaceResultsFilters = { season?: string; raceId?: number; latest?: boolean };

export async function getLapTimes(filters?: LapTimeFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const seasonRaces = raceCatalog
    .filter((race) => race.season === season)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const selectedRaceId = filters?.raceId ?? seasonRaces[0]?.id;

  if (!selectedRaceId) {
    return bestLapResponseSchema.parse({ success: true, data: [] });
  }

  const raceLapTimes = [...(raceBestLapTimes[selectedRaceId] ?? [])].sort((a, b) => a.bestLap - b.bestLap);

  return bestLapResponseSchema.parse({ success: true, data: raceLapTimes });
}

export async function getRaceResults(filters?: RaceResultsFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const seasonRaces = raceCatalog
    .filter((race) => race.season === season)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const selectedRace = filters?.latest
    ? seasonRaces[seasonRaces.length - 1]
    : seasonRaces.find((race) => race.id === filters?.raceId) ?? seasonRaces[seasonRaces.length - 1];

  if (!selectedRace) {
    return raceResultsResponseSchema.parse({ success: true, data: { race: null, results: [] } });
  }

  return raceResultsResponseSchema.parse({
    success: true,
    data: {
      race: selectedRace,
      results: raceResultsById[selectedRace.id] ?? [],
    },
  });
}

type StatsFilters = { season?: string };

type ConsistencyFilters = { season?: string };

export async function getStats(filters?: StatsFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const drivers = season === "2025" ? mockDrivers2025 : mockDrivers2026;
  const teams = season === "2025" ? mockTeams2025 : mockTeams2026;
  const topDriver = drivers.reduce((leader: Driver, driver: Driver) =>
    driver.points > leader.points ? driver : leader
  );
  const topTeam = teams.reduce((leader: Team, team: Team) =>
    team.points > leader.points ? team : leader
  );
  const totalPoints = season === "2026"
    ? drivers.reduce((sum: number, driver: Driver) => sum + driver.points, 0)
    : legacyTotalPointsBySeason[season] ?? drivers.reduce((sum: number, driver: Driver) => sum + driver.points, 0);

  const totalRaces = raceCatalog.filter((race) => race.season === season).length;

  return statsResponseSchema.parse({
    success: true,
    data: {
      totalRaces,
      topDriver: topDriver.name,
      topTeam: topTeam.name,
      totalPoints,
    },
  });
}

export async function getConsistency(filters?: ConsistencyFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const seasonRaces = raceCatalog
    .filter((race) => race.season === season)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const positionMap = new Map<string, number[]>();

  seasonRaces.forEach((race) => {
    const results = raceResultsById[race.id] ?? [];

    results.forEach((entry) => {
      const parsedPosition = Number.parseInt(entry.positionLabel, 10);

      if (!Number.isFinite(parsedPosition)) {
        return;
      }

      const positions = positionMap.get(entry.driverName) ?? [];
      positions.push(parsedPosition);
      positionMap.set(entry.driverName, positions);
    });
  });

  const consistencyRows = Array.from(positionMap.entries())
    .map(([driver, positions], index) => {
      const avgPosition = positions.reduce((sum, position) => sum + position, 0) / positions.length;
      const variance = positions.reduce((sum, position) => sum + (position - avgPosition) ** 2, 0) / positions.length;
      const positionSpread = Math.sqrt(variance);
      const normalizedAverageScore = Math.max(0, 100 - ((avgPosition - 1) / 19) * 65);
      const normalizedSpreadPenalty = Math.min(28, positionSpread * 9);
      const score = Math.max(0, Math.min(100, Math.round(normalizedAverageScore - normalizedSpreadPenalty)));

      return {
        id: index + 1,
        driver,
        score,
        avgPosition: Number(avgPosition.toFixed(1)),
      };
    })
    .sort((left, right) => right.score - left.score || left.avgPosition - right.avgPosition || left.driver.localeCompare(right.driver));

  return consistencyResponseSchema.parse({ success: true, data: consistencyRows });
}
