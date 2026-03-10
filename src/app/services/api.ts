// No comments found in this file. No changes needed.
import { projectId, publicAnonKey } from '../../../utils/supabase/info.tsx';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-93f7169e`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function getDrivers(filters?: { team?: string; search?: string }) {
  const mockDrivers = [
    { id: 1, name: "Max Verstappen", number: 3, team: "Red Bull Racing", nationality: "Netherlands", age: 28, points: 198, wins: 2, podiums: 8, championships: 3, image: "/Driver Images/Max.avif" },
    { id: 2, name: "Isack Hadjar", number: 20, team: "Red Bull Racing", nationality: "France", age: 21, points: 120, wins: 0, podiums: 2, championships: 0, image: "/Driver Images/Isack.avif" },
    { id: 3, name: "Charles Leclerc", number: 16, team: "Ferrari", nationality: "Monaco", age: 28, points: 312, wins: 5, podiums: 12, championships: 0, image: "/Driver Images/Charles.avif" },
    { id: 4, name: "Lewis Hamilton", number: 44, team: "Ferrari", nationality: "Great Britain", age: 41, points: 276, wins: 4, podiums: 10, championships: 7, image: "/Driver Images/Lewis.avif" },
    { id: 5, name: "George Russell", number: 63, team: "Mercedes", nationality: "Great Britain", age: 28, points: 187, wins: 1, podiums: 7, championships: 0, image: "/Driver Images/Russel.avif" },
    { id: 6, name: "Kimi Antonelli", number: 7, team: "Mercedes", nationality: "Italy", age: 19, points: 90, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Antonelli.avif" },
    { id: 7, name: "Lando Norris", number: 1, team: "McLaren", nationality: "Great Britain", age: 26, points: 224, wins: 3, podiums: 9, championships: 0, image: "/Driver Images/Norris.avif" },
    { id: 8, name: "Oscar Piastri", number: 81, team: "McLaren", nationality: "Australia", age: 25, points: 178, wins: 2, podiums: 6, championships: 0, image: "/Driver Images/Oscar.avif" },
    { id: 9, name: "Fernando Alonso", number: 14, team: "Aston Martin", nationality: "Spain", age: 44, points: 120, wins: 2, podiums: 4, championships: 2, image: "/Driver Images/Alonso.avif" },
    { id: 10, name: "Lance Stroll", number: 18, team: "Aston Martin", nationality: "Canada", age: 27, points: 80, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Stroll.avif" },
    { id: 11, name: "Nico Hulkenberg", number: 27, team: "Audi", nationality: "Germany", age: 38, points: 55, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Hulkenburg.avif" },
    { id: 12, name: "Gabriel Bortoleto", number: 21, team: "Audi", nationality: "Brazil", age: 22, points: 60, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Borteoleto.avif" },
    { id: 13, name: "Pierre Gasly", number: 10, team: "Alpine", nationality: "France", age: 30, points: 98, wins: 1, podiums: 2, championships: 0, image: "/Driver Images/Gasly.avif" },
    { id: 14, name: "Franco Colapinto", number: 24, team: "Alpine", nationality: "Argentina", age: 23, points: 70, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Colapinto.avif" },
    { id: 15, name: "Carlos Sainz", number: 55, team: "Williams", nationality: "Spain", age: 31, points: 156, wins: 1, podiums: 5, championships: 0, image: "/Driver Images/Sainz.avif" },
    { id: 16, name: "Alexander Albon", number: 23, team: "Williams", nationality: "Thailand", age: 30, points: 75, wins: 0, podiums: 2, championships: 0, image: "/Driver Images/Albon.avif" },
    { id: 17, name: "Liam Lawson", number: 40, team: "Racing Bulls", nationality: "New Zealand", age: 24, points: 45, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Lawson.avif" },
    { id: 18, name: "Arvid Lindblad", number: 46, team: "Racing Bulls", nationality: "United Kingdom", age: 18, points: 30, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Lindblad.avif" },
    { id: 19, name: "Esteban Ocon", number: 31, team: "Haas F1 Team", nationality: "France", age: 29, points: 110, wins: 1, podiums: 3, championships: 0, image: "/Driver Images/Ocon.avif" },
    { id: 20, name: "Oliver Bearman", number: 50, team: "Haas F1 Team", nationality: "United Kingdom", age: 20, points: 40, wins: 0, podiums: 1, championships: 0, image: "/Driver Images/Bearman.avif" },
    { id: 21, name: "Sergio Perez", number: 11, team: "Cadillac", nationality: "Mexico", age: 36, points: 142, wins: 0, podiums: 4, championships: 0, image: "/Driver Images/Perez.avif" },
    { id: 22, name: "Valtteri Bottas", number: 77, team: "Cadillac", nationality: "Finland", age: 36, points: 70, wins: 1, podiums: 3, championships: 0, image: "/Driver Images/Bottas.avif" },
  ];


  let filteredDrivers = [...mockDrivers];

  if (filters?.team && filters.team !== "all") {
    filteredDrivers = filteredDrivers.filter(d => d.team === filters.team);
  }

  if (filters?.search) {
    filteredDrivers = filteredDrivers.filter(d =>
      d.name.toLowerCase().includes(filters.search!.toLowerCase())
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

export async function getTeams() {
  const mockTeams = [
    { id: 1, name: "Mercedes", color: "#06B6D4", points: 43, wins: 1, podiums: 2, championships: 8, image: "/Team Images/Mercedes.avif" },
    { id: 2, name: "Ferrari", color: "#DC2626", points: 27, wins: 0, podiums: 1, championships: 16, image: "/Team Images/Ferrari.avif" },
    { id: 3, name: "McLaren", color: "#F97316", points: 10, wins: 5, podiums: 0, championships: 8, image: "/Team Images/McLaren.avif" },
    { id: 4, name: "Red Bull Racing", color: "#1c46ce", points: 8, wins: 0, podiums: 0, championships: 6, image: "/Team Images/Redbull.avif" },
    { id: 5, name: "Haas F1 Team", color: "#f7f5f5", points: 6, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Haas.avif" },
    { id: 6, name: "Racing Bulls", color: "#7594c2", points: 4, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Racingbulls.avif" },
    { id: 7, name: "Audi", color: "#771716", points: 2, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Audi.avif" },
    { id: 8, name: "Alpine", color: "#2871cb", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Alpine.png" },
    { id: 9, name: "Williams", color: "#104fb4", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Williams.avif" },
    { id: 10, name: "Cadillac", color: "#444749", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Cadillac.avif" },
    { id: 11, name: "Aston Martin", color: "#10853b", points: 0, wins: 0, podiums: 0, championships: 0, image: "/Team Images/Aston.avif" },
  ];
  return { success: true, data: mockTeams };
}

export async function getRaces() {
  const mockRaces = [
    { id: 1, name: "Bahrain Grand Prix", country: "Bahrain", date: "2026-03-01", circuit: "Bahrain International Circuit", winner: "Charles Leclerc", fastestLap: "Lando Norris" },
    { id: 2, name: "Saudi Arabian Grand Prix", country: "Saudi Arabia", date: "2026-03-08", circuit: "Jeddah Corniche Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
    { id: 3, name: "Australian Grand Prix", country: "Australia", date: "2026-03-15", circuit: "Albert Park Circuit", winner: "Lando Norris", fastestLap: "Oscar Piastri" },
    { id: 4, name: "Japanese Grand Prix", country: "Japan", date: "2026-04-05", circuit: "Suzuka Circuit", winner: "Charles Leclerc", fastestLap: "Lewis Hamilton" },
    { id: 5, name: "Chinese Grand Prix", country: "China", date: "2026-04-19", circuit: "Shanghai International Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
  ];
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

export async function getTeamPerformance() {
  const mockTeamPerformance = [
    { id: 1, season: "2023", ferrari: 551, mclaren: 302, redBull: 860, mercedes: 409 },
    { id: 2, season: "2024", ferrari: 623, mclaren: 378, redBull: 791, mercedes: 452 },
    { id: 3, season: "2025", ferrari: 587, mclaren: 412, redBull: 823, mercedes: 489 },
    { id: 4, season: "2026", ferrari: 588, mclaren: 402, redBull: 340, mercedes: 187 },
  ];
  return { success: true, data: mockTeamPerformance };
}

export async function getConsistency() {
  const mockConsistency = [
    { id: 1, driver: "Leclerc", score: 94, avgPosition: 1.8 },
    { id: 2, driver: "Hamilton", score: 91, avgPosition: 2.3 },
    { id: 3, driver: "Norris", score: 88, avgPosition: 2.9 },
    { id: 4, driver: "Verstappen", score: 85, avgPosition: 3.5 },
    { id: 5, driver: "Piastri", score: 81, avgPosition: 4.2 },
    { id: 6, driver: "Russell", score: 78, avgPosition: 5.1 },
    { id: 7, driver: "Sainz", score: 75, avgPosition: 5.7 },
    { id: 8, driver: "Perez", score: 71, avgPosition: 6.8 },
  ];
  return { success: true, data: mockConsistency };
}

export async function getStats() {
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

  const mockTeams = [
    { id: 1, name: "Mercedes", color: "#06B6D4", points: 43, wins: 1, podiums: 2, championships: 8 },
    { id: 2, name: "Ferrari", color: "#DC2626", points: 27, wins: 0, podiums: 1, championships: 16 },
    { id: 3, name: "McLaren", color: "#F97316", points: 10, wins: 5, podiums: 0, championships: 8 },
    { id: 4, name: "Red Bull Racing", color: "#1c46ce", points: 8, wins: 0, podiums: 0, championships: 6 },
    { id: 5, name: "Haas F1 Team", color: "#f7f5f5", points: 6, wins: 0, podiums: 0, championships: 0 },
    { id: 6, name: "Racing Bulls", color: "#7594c2", points: 4, wins: 0, podiums: 0, championships: 0 },
    { id: 7, name: "Audi", color: "#771716", points: 2, wins: 0, podiums: 0, championships: 0 },
    { id: 8, name: "Alpine", color: "#2871cb", points: 0, wins: 0, podiums: 0, championships: 0 },
    { id: 9, name: "Williams", color: "#104fb4", points: 0, wins: 0, podiums: 0, championships: 0 },
    { id: 10, name: "Cadillac", color: "#444749", points: 0, wins: 0, podiums: 0, championships: 0 },
    { id: 11, name: "Aston Martin", color: "#10853b", points: 0, wins: 0, podiums: 0, championships: 0 },
  ];

  const mockRaces = [
    { id: 1, name: "Bahrain Grand Prix", country: "Bahrain", date: "2026-03-01", circuit: "Bahrain International Circuit", winner: "Charles Leclerc", fastestLap: "Lando Norris" },
    { id: 2, name: "Saudi Arabian Grand Prix", country: "Saudi Arabia", date: "2026-03-08", circuit: "Jeddah Corniche Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
    { id: 3, name: "Australian Grand Prix", country: "Australia", date: "2026-03-15", circuit: "Albert Park Circuit", winner: "Lando Norris", fastestLap: "Oscar Piastri" },
    { id: 4, name: "Japanese Grand Prix", country: "Japan", date: "2026-04-05", circuit: "Suzuka Circuit", winner: "Charles Leclerc", fastestLap: "Lewis Hamilton" },
    { id: 5, name: "Chinese Grand Prix", country: "China", date: "2026-04-19", circuit: "Shanghai International Circuit", winner: "Lewis Hamilton", fastestLap: "Charles Leclerc" },
  ];

  let topDriver = mockDrivers[0] || {};
  for (const d of mockDrivers) {
    if (d.points > topDriver.points) {
      topDriver = d;
    }
  }

  let topTeam = mockTeams[0] || {};
  for (const t of mockTeams) {
    if (t.points > topTeam.points) {
      topTeam = t;
    }
  }

  let totalPoints = 0;
  for (const d of mockDrivers) {
    totalPoints = totalPoints + d.points;
  }

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
