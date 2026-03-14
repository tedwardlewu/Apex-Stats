type DriverFilters = { team?: string; search?: string; season?: string };

const DEFAULT_SEASON = "2026";

const mockDrivers2026 = [
    { id: 1, name: "Max Verstappen", number: 3, team: "Red Bull Racing", nationality: "Netherlands", age: 28, points: 8, wins: 0, podiums: 0, championships: 3, image: "/Driver Images/Max.avif" },
    { id: 2, name: "Isack Hadjar", number: 20, team: "Red Bull Racing", nationality: "France", age: 21, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Isack.avif" },
    { id: 3, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", age: 28, points: 22, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Charles.avif" },
    { id: 4, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "Great Britain", age: 41, points: 18, wins: 0, podiums: 0, championships: 7, image: "/Driver Images/Lewis.avif" },
    { id: 5, name: "George Russell", number: 63, team: "Mercedes", nationality: "Great Britain", age: 28, points: 33, wins: 1, podiums: 1, championships: 0, image: "/Driver Images/Russel.avif" },
    { id: 6, name: "Kimi Antonelli", number: 7, team: "Mercedes", nationality: "Italy", age: 19, points: 22, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Antonelli.avif" },
    { id: 7, name: "Lando Norris", number: 1, team: "McLaren", nationality: "Great Britain", age: 26, points: 15, wins: 0, podiums: 0, championships: 1, image: "/Driver Images/Norris.avif" },
    { id: 8, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", age: 25, points: 3, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Oscar.avif" },
    { id: 9, name: "Fernando Alonso", number: 14, team: "Aston Martin", nationality: "Spain", age: 44, points: 0, wins: 0, podiums: 0, championships: 2, image: "/Driver Images/Alonso.avif" },
    { id: 10, name: "Lance Stroll", number: 18, team: "Aston Martin", nationality: "Canada", age: 27, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Stroll.avif" },
    { id: 11, name: "Nico Hulkenberg", number: 27, team: "Audi", nationality: "Germany", age: 38, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Hulkenburg.avif" },
    { id: 12, name: "Gabriel Bortoleto", number: 21, team: "Audi", nationality: "Brazil", age: 22, points: 2, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Borteoleto.avif" },
    { id: 13, name: "Pierre Gasly", number: 10, team: "Alpine", nationality: "France", age: 30, points: 1, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Gasly.avif" },
    { id: 14, name: "Franco Colapinto", number: 24, team: "Alpine", nationality: "Argentina", age: 23, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Colapinto.avif" },
    { id: 15, name: "Carlos Sainz", number: 55, team: "Williams", nationality: "Spain", age: 31, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Sainz.avif" },
    { id: 16, name: "Alexander Albon", number: 23, team: "Williams", nationality: "Thailand", age: 30, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Albon.avif" },
    { id: 17, name: "Liam Lawson", number: 40, team: "Racing Bulls", nationality: "New Zealand", age: 24, points: 2, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Lawson.avif" },
    { id: 18, name: "Arvid Lindblad", number: 46, team: "Racing Bulls", nationality: "United Kingdom", age: 18, points: 4, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Lindblad.avif" },
    { id: 19, name: "Esteban Ocon", number: 31, team: "Haas F1 Team", nationality: "France", age: 29, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Ocon.avif" },
    { id: 20, name: "Oliver Bearman", number: 50, team: "Haas F1 Team", nationality: "United Kingdom", age: 20, points: 7, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Bearman.avif" },
    { id: 21, name: "Sergio Perez", number: 11, team: "Cadillac", nationality: "Mexico", age: 36, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Perez.avif" },
    { id: 22, name: "Valtteri Bottas", number: 77, team: "Cadillac", nationality: "Finland", age: 36, points: 0, wins: 0, podiums: 0, championships: 0, image: "/Driver Images/Bottas.avif" },
];

const mockDrivers2025 = [
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
];

const mockTeams2026 = [
  { id: 1, name: "Mercedes", color: "#06B6D4", points: 55, wins: 1, podiums: 2, championships: 16, image: "/Team Images/Mercedes.avif" },
  { id: 2, name: "Ferrari", color: "#DC2626", points: 40, wins: 0, podiums: 2, championships: 8, image: "/Team Images/Ferrari.avif" },
  { id: 3, name: "McLaren", color: "#F97316", points: 18, wins: 0, podiums: 0, championships: 8, image: "/Team Images/McLaren.avif" },
  { id: 4, name: "Red Bull Racing", color: "#1c46ce", points: 8, wins: 0, podiums: 0, championships: 6, image: "/Team Images/Redbull.avif" },
  { id: 5, name: "Haas F1 Team", color: "#f7f5f5", points: 7, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Haas.avif" },
  { id: 6, name: "Racing Bulls", color: "#7594c2", points: 6, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Racingbulls.avif" },
  { id: 7, name: "Audi", color: "#771716", points: 2, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Audi.avif" },
  { id: 8, name: "Alpine", color: "#2871cb", points: 1, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Alpine.avif" },
  { id: 9, name: "Williams", color: "#104fb4", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Williams.avif" },
  { id: 10, name: "Cadillac", color: "#444749", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Cadillac.avif" },
  { id: 11, name: "Aston Martin", color: "#10853b", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Aston.avif" },
];

const mockTeams2025 = [
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
];

const mockRaces = [
  { id: 1, name: "Bahrain Grand Prix", country: "Bahrain", date: "2026-03-01", circuit: "Bahrain International Circuit", winner: "Charles Leclerc", fastestLap: "Lando Norris" },
  { id: 2, name: "Saudi Arabian Grand Prix", country: "Saudi Arabia", date: "2026-03-08", circuit: "Jeddah Corniche Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
  { id: 3, name: "Australian Grand Prix", country: "Australia", date: "2026-03-15", circuit: "Albert Park Circuit", winner: "Lando Norris", fastestLap: "Oscar Piastri" },
  { id: 4, name: "Japanese Grand Prix", country: "Japan", date: "2026-04-05", circuit: "Suzuka Circuit", winner: "Charles Leclerc", fastestLap: "Lewis Hamilton" },
  { id: 5, name: "Chinese Grand Prix", country: "China", date: "2026-04-19", circuit: "Shanghai International Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
];

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
  const baseDrivers = season === "2025" ? mockDrivers2025 : mockDrivers2026;
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

  return { success: true, data: filteredDrivers };
}

export async function getDriverById(id: number) {
  const mockDrivers = [
    { id: 1, name: "Max Verstappen", number: 1, team: "Red Bull Racing", nationality: "Netherlands", points: 198, wins: 2, podiums: 8, championships: 3 },
    { id: 2, name: "Sergio Perez", number: 11, team: "Red Bull Racing", nationality: "Mexico", points: 142, wins: 0, podiums: 4, championships: 0 },
    { id: 3, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "Great Britain", points: 276, wins: 4, podiums: 10, championships: 7 },
    { id: 4, name: "George Russell", number: 63, team: "Mercedes", nationality: "Great Britain", points: 187, wins: 1, podiums: 7, championships: 0 },
    { id: 5, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", points: 312, wins: 5, podiums: 12, championships: 0 },
    { id: 6, name: "Carlos Sainz", number: 55, team: "Williams", nationality: "Spain", points: 156, wins: 1, podiums: 5, championships: 0 },
    { id: 7, name: "Lando Norris", number: 4, team: "McLaren", nationality: "Great Britain", points: 224, wins: 3, podiums: 9, championships: 0 },
    { id: 8, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", points: 178, wins: 2, podiums: 6, championships: 0 },
  ];

  const driver = mockDrivers.find(d => d.id === id);
  if (!driver) {
    return { success: false, error: "Driver not found" };
  }

  return { success: true, data: driver };
}

type TeamFilters = { season?: string };

export async function getTeams(filters?: TeamFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;

  return { success: true, data: season === "2025" ? mockTeams2025 : mockTeams2026 };
}

export async function getRaces() {
  return { success: true, data: mockRaces };
}

export async function getLapTimes() {
  const mockLapTimes = [
    { lap: 1, leclerc: 91.8, hamilton: 92.2, norris: 92.5, verstappen: 92.8 },
    { lap: 5, leclerc: 90.5, hamilton: 90.9, norris: 91.2, verstappen: 91.5 },
    { lap: 10, leclerc: 89.9, hamilton: 90.2, norris: 90.6, verstappen: 90.9 },
    { lap: 15, leclerc: 89.5, hamilton: 89.8, norris: 90.2, verstappen: 90.5 },
    { lap: 20, leclerc: 89.2, hamilton: 89.5, norris: 89.9, verstappen: 90.2 },
    { lap: 25, leclerc: 89.0, hamilton: 89.3, norris: 89.7, verstappen: 90.0 },
    { lap: 30, leclerc: 88.8, hamilton: 89.1, norris: 89.5, verstappen: 89.8 },
    { lap: 35, leclerc: 88.6, hamilton: 88.9, norris: 89.3, verstappen: 89.6 },
    { lap: 40, leclerc: 88.5, hamilton: 88.8, norris: 89.2, verstappen: 89.5 },
    { lap: 45, leclerc: 88.4, hamilton: 88.7, norris: 89.1, verstappen: 89.4 },
    { lap: 50, leclerc: 88.3, hamilton: 88.6, norris: 89.0, verstappen: 89.3 },
  ];
  return { success: true, data: mockLapTimes };
}

type StatsFilters = { season?: string };

export async function getStats(filters?: StatsFilters) {
  const season = filters?.season ?? DEFAULT_SEASON;
  const drivers = season === "2025" ? mockDrivers2025 : mockDrivers2026;
  const teams = season === "2025" ? mockTeams2025 : mockTeams2026;
  const topDriver = drivers.reduce((leader, driver) =>
    driver.points > leader.points ? driver : leader
  );
  const topTeam = teams.reduce((leader, team) =>
    team.points > leader.points ? team : leader
  );
  const totalPoints = season === "2026"
    ? drivers.reduce((sum, driver) => sum + driver.points, 0)
    : legacyTotalPointsBySeason[season] ?? drivers.reduce((sum, driver) => sum + driver.points, 0);

  const totalRaces = mockRaces.length;

  return {
    success: true,
    data: {
      totalRaces,
      topDriver: topDriver.name,
      topTeam: topTeam.name,
      totalPoints,
    },
  };
}
