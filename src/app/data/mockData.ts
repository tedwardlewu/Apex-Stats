// Mock F1 data for Apex Stats

export interface Driver {
  id: number;
  name: string;
  number: number;
  team: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
  image: string;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  points: number;
  wins: number;
  podiums: number;
  championships: number;
}

export interface Race {
  id: number;
  name: string;
  country: string;
  date: string;
  circuit: string;
  winner: string;
  fastestLap: string;
}

export interface DriverSeasonStats {
  season: number;
  points: number;
  wins: number;
  podiums: number;
}

export const drivers: Driver[] = [
  {
    id: 1,
    name: "Max Verstappen",
    number: 1,
    team: "Red Bull Racing",
    nationality: "Netherlands",
    points: 198,
    wins: 2,
    podiums: 8,
    championships: 3,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Sergio Perez",
    number: 11,
    team: "Red Bull Racing",
    nationality: "Mexico",
    points: 142,
    wins: 0,
    podiums: 4,
    championships: 0,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Lewis Hamilton",
    number: 44,
    team: "Ferrari",
    nationality: "Great Britain",
    points: 276,
    wins: 4,
    podiums: 10,
    championships: 7,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    name: "George Russell",
    number: 63,
    team: "Mercedes",
    nationality: "Great Britain",
    points: 187,
    wins: 1,
    podiums: 7,
    championships: 0,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    name: "Charles Leclerc",
    number: 16,
    team: "Ferrari",
    nationality: "Monaco",
    points: 312,
    wins: 5,
    podiums: 12,
    championships: 0,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    name: "Carlos Sainz",
    number: 55,
    team: "Williams",
    nationality: "Spain",
    points: 156,
    wins: 1,
    podiums: 5,
    championships: 0,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 7,
    name: "Lando Norris",
    number: 4,
    team: "McLaren",
    nationality: "Great Britain",
    points: 224,
    wins: 3,
    podiums: 9,
    championships: 0,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  },
  {
    id: 8,
    name: "Oscar Piastri",
    number: 81,
    team: "McLaren",
    nationality: "Australia",
    points: 178,
    wins: 2,
    podiums: 6,
    championships: 0,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=400&fit=crop"
  }
];

export const teams: Team[] = [
  {
    id: 1,
    name: "Ferrari",
    color: "#DC2626",
    points: 588,
    wins: 9,
    podiums: 22,
    championships: 16
  },
  {
    id: 2,
    name: "McLaren",
    color: "#F97316",
    points: 402,
    wins: 5,
    podiums: 15,
    championships: 8
  },
  {
    id: 3,
    name: "Red Bull Racing",
    color: "#1E40AF",
    points: 340,
    wins: 2,
    podiums: 12,
    championships: 6
  },
  {
    id: 4,
    name: "Mercedes",
    color: "#06B6D4",
    points: 187,
    wins: 1,
    podiums: 7,
    championships: 8
  }
];

export const races: Race[] = [
  {
    id: 1,
    name: "Bahrain Grand Prix",
    country: "Bahrain",
    date: "2026-03-01",
    circuit: "Bahrain International Circuit",
    winner: "Charles Leclerc",
    fastestLap: "Lando Norris"
  },
  {
    id: 2,
    name: "Saudi Arabian Grand Prix",
    country: "Saudi Arabia",
    date: "2026-03-08",
    circuit: "Jeddah Corniche Circuit",
    winner: "Lewis Hamilton",
    fastestLap: "Charles Leclerc"
  },
  {
    id: 3,
    name: "Australian Grand Prix",
    country: "Australia",
    date: "2026-03-15",
    circuit: "Albert Park Circuit",
    winner: "Lando Norris",
    fastestLap: "Oscar Piastri"
  },
  {
    id: 4,
    name: "Japanese Grand Prix",
    country: "Japan",
    date: "2026-04-05",
    circuit: "Suzuka Circuit",
    winner: "Charles Leclerc",
    fastestLap: "Lewis Hamilton"
  },
  {
    id: 5,
    name: "Chinese Grand Prix",
    country: "China",
    date: "2026-04-19",
    circuit: "Shanghai International Circuit",
    winner: "Lewis Hamilton",
    fastestLap: "Charles Leclerc"
  }
];

export const driverSeasonHistory: Record<number, DriverSeasonStats[]> = {
  1: [ // Max Verstappen
    { season: 2023, points: 575, wins: 19, podiums: 21 },
    { season: 2024, points: 437, wins: 11, podiums: 17 },
    { season: 2025, points: 454, wins: 13, podiums: 18 },
    { season: 2026, points: 198, wins: 2, podiums: 8 }
  ],
  3: [ // Lewis Hamilton
    { season: 2023, points: 234, wins: 1, podiums: 6 },
    { season: 2024, points: 289, wins: 2, podiums: 9 },
    { season: 2025, points: 312, wins: 3, podiums: 11 },
    { season: 2026, points: 276, wins: 4, podiums: 10 }
  ],
  5: [ // Charles Leclerc
    { season: 2023, points: 307, wins: 5, podiums: 11 },
    { season: 2024, points: 356, wins: 6, podiums: 13 },
    { season: 2025, points: 289, wins: 4, podiums: 10 },
    { season: 2026, points: 312, wins: 5, podiums: 12 }
  ]
};

export const lapTimeData = [
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
  { lap: 50, leclerc: 88.3, hamilton: 88.6, norris: 89.0, verstappen: 89.3 }
];

export const teamPerformanceData = [
  { season: "2023", ferrari: 551, mclaren: 302, redBull: 860, mercedes: 409 },
  { season: "2024", ferrari: 623, mclaren: 378, redBull: 791, mercedes: 452 },
  { season: "2025", ferrari: 587, mclaren: 412, redBull: 823, mercedes: 489 },
  { season: "2026", ferrari: 588, mclaren: 402, redBull: 340, mercedes: 187 }
];

export const consistency = [
  { driver: "Leclerc", score: 94, avgPosition: 1.8 },
  { driver: "Hamilton", score: 91, avgPosition: 2.3 },
  { driver: "Norris", score: 88, avgPosition: 2.9 },
  { driver: "Verstappen", score: 85, avgPosition: 3.5 },
  { driver: "Piastri", score: 81, avgPosition: 4.2 },
  { driver: "Russell", score: 78, avgPosition: 5.1 },
  { driver: "Sainz", score: 75, avgPosition: 5.7 },
  { driver: "Perez", score: 71, avgPosition: 6.8 }
];