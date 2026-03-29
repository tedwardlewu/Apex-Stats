export interface RaceMetadata {
  id: number;
  season: string;
  name: string;
  country: string;
  date: string;
  circuit: string;
  winner: string;
  fastestLap: string;
}

export interface DriverBestLap {
  driverName: string;
  bestLap: number;
}

export interface RaceResultEntry {
  positionLabel: string;
  carNumber: number;
  driverName: string;
  team: string;
  points: number;
  lapsCompleted: number;
  result: string;
}

export const raceCatalog: RaceMetadata[] = [
  {
    id: 101,
    season: "2026",
    name: "Australian Grand Prix",
    country: "Melbourne, Australia",
    date: "2026-03-08",
    circuit: "Melbourne Grand Prix Circuit",
    winner: "George Russell",
    fastestLap: "Max Verstappen",
  },
  {
    id: 102,
    season: "2026",
    name: "Chinese Grand Prix",
    country: "Shanghai, China",
    date: "2026-03-15",
    circuit: "Shanghai International Circuit",
    winner: "Kimi Antonelli",
    fastestLap: "Kimi Antonelli",
  },
  {
    id: 103,
    season: "2026",
    name: "Japanese Grand Prix",
    country: "Suzuka, Japan",
    date: "2026-03-29",
    circuit: "Suzuka Circuit",
    winner: "Kimi Antonelli",
    fastestLap: "Kimi Antonelli",
  },
];

export const raceBestLapTimes: Record<number, DriverBestLap[]> = {
  101: [
    { driverName: "Max Verstappen", bestLap: 82.091 },
    { driverName: "Lando Norris", bestLap: 82.358 },
    { driverName: "Kimi Antonelli", bestLap: 82.417 },
    { driverName: "Lewis Hamilton", bestLap: 82.423 },
    { driverName: "Charles Leclerc", bestLap: 82.579 },
    { driverName: "George Russell", bestLap: 82.67 },
    { driverName: "Franco Colapinto", bestLap: 82.926 },
    { driverName: "Gabriel Bortoleto", bestLap: 83.257 },
    { driverName: "Carlos Sainz", bestLap: 83.59 },
    { driverName: "Liam Lawson", bestLap: 83.783 },
    { driverName: "Oliver Bearman", bestLap: 84.02 },
    { driverName: "Arvid Lindblad", bestLap: 84.182 },
    { driverName: "Alexander Albon", bestLap: 84.375 },
    { driverName: "Esteban Ocon", bestLap: 84.424 },
    { driverName: "Pierre Gasly", bestLap: 84.486 },
    { driverName: "Isack Hadjar", bestLap: 85.239 },
    { driverName: "Lance Stroll", bestLap: 85.41 },
    { driverName: "Fernando Alonso", bestLap: 85.713 },
    { driverName: "Sergio Perez", bestLap: 86.07 },
    { driverName: "Valtteri Bottas", bestLap: 87.364 },
  ],
  102: [
    { driverName: "Kimi Antonelli", bestLap: 95.275 },
    { driverName: "George Russell", bestLap: 95.4 },
    { driverName: "Esteban Ocon", bestLap: 95.964 },
    { driverName: "Charles Leclerc", bestLap: 96.011 },
    { driverName: "Lewis Hamilton", bestLap: 96.092 },
    { driverName: "Arvid Lindblad", bestLap: 96.099 },
    { driverName: "Nico Hulkenberg", bestLap: 96.18 },
    { driverName: "Oliver Bearman", bestLap: 96.429 },
    { driverName: "Pierre Gasly", bestLap: 96.505 },
    { driverName: "Franco Colapinto", bestLap: 96.783 },
    { driverName: "Max Verstappen", bestLap: 97.046 },
    { driverName: "Liam Lawson", bestLap: 97.096 },
    { driverName: "Isack Hadjar", bestLap: 97.311 },
    { driverName: "Carlos Sainz", bestLap: 97.981 },
    { driverName: "Valtteri Bottas", bestLap: 98.393 },
    { driverName: "Sergio Perez", bestLap: 98.523 },
    { driverName: "Fernando Alonso", bestLap: 99.721 },
    { driverName: "Lance Stroll", bestLap: 100.883 },
  ],
  103: [
    { driverName: "Kimi Antonelli", bestLap: 90.845 },
    { driverName: "Oscar Piastri", bestLap: 91.102 },
    { driverName: "Charles Leclerc", bestLap: 91.245 },
    { driverName: "George Russell", bestLap: 91.389 },
    { driverName: "Lando Norris", bestLap: 91.501 },
    { driverName: "Lewis Hamilton", bestLap: 91.678 },
    { driverName: "Pierre Gasly", bestLap: 91.834 },
    { driverName: "Max Verstappen", bestLap: 91.956 },
    { driverName: "Liam Lawson", bestLap: 92.134 },
    { driverName: "Esteban Ocon", bestLap: 92.289 },
    { driverName: "Nico Hulkenberg", bestLap: 92.401 },
    { driverName: "Isack Hadjar", bestLap: 92.567 },
    { driverName: "Gabriel Bortoleto", bestLap: 92.712 },
    { driverName: "Arvid Lindblad", bestLap: 92.889 },
    { driverName: "Carlos Sainz", bestLap: 93.045 },
    { driverName: "Franco Colapinto", bestLap: 93.201 },
    { driverName: "Sergio Perez", bestLap: 93.456 },
    { driverName: "Fernando Alonso", bestLap: 93.789 },
    { driverName: "Valtteri Bottas", bestLap: 94.123 },
    { driverName: "Alexander Albon", bestLap: 94.456 },
    { driverName: "Lance Stroll", bestLap: 95.234 },
    { driverName: "Oliver Bearman", bestLap: 95.612 },
  ],
};

export const raceResultsById: Record<number, RaceResultEntry[]> = {
  101: [
    { positionLabel: "1", carNumber: 63, driverName: "George Russell", team: "Mercedes", lapsCompleted: 58, result: "1:23:06.801", points: 25 },
    { positionLabel: "2", carNumber: 12, driverName: "Kimi Antonelli", team: "Mercedes", lapsCompleted: 58, result: "+2.974s", points: 18 },
    { positionLabel: "3", carNumber: 16, driverName: "Charles Leclerc", team: "Ferrari", lapsCompleted: 58, result: "+15.519s", points: 15 },
    { positionLabel: "4", carNumber: 44, driverName: "Lewis Hamilton", team: "Ferrari", lapsCompleted: 58, result: "+16.144s", points: 12 },
    { positionLabel: "5", carNumber: 1, driverName: "Lando Norris", team: "McLaren", lapsCompleted: 58, result: "+51.741s", points: 10 },
    { positionLabel: "6", carNumber: 3, driverName: "Max Verstappen", team: "Red Bull Racing", lapsCompleted: 58, result: "+54.617s", points: 8 },
    { positionLabel: "7", carNumber: 87, driverName: "Oliver Bearman", team: "Haas F1 Team", lapsCompleted: 57, result: "+1 lap", points: 6 },
    { positionLabel: "8", carNumber: 41, driverName: "Arvid Lindblad", team: "Racing Bulls", lapsCompleted: 57, result: "+1 lap", points: 4 },
    { positionLabel: "9", carNumber: 5, driverName: "Gabriel Bortoleto", team: "Audi", lapsCompleted: 57, result: "+1 lap", points: 2 },
    { positionLabel: "10", carNumber: 10, driverName: "Pierre Gasly", team: "Alpine", lapsCompleted: 57, result: "+1 lap", points: 1 },
    { positionLabel: "11", carNumber: 31, driverName: "Esteban Ocon", team: "Haas F1 Team", lapsCompleted: 57, result: "+1 lap", points: 0 },
    { positionLabel: "12", carNumber: 23, driverName: "Alexander Albon", team: "Williams", lapsCompleted: 57, result: "+1 lap", points: 0 },
    { positionLabel: "13", carNumber: 30, driverName: "Liam Lawson", team: "Racing Bulls", lapsCompleted: 57, result: "+1 lap", points: 0 },
    { positionLabel: "14", carNumber: 43, driverName: "Franco Colapinto", team: "Alpine", lapsCompleted: 56, result: "+2 laps", points: 0 },
    { positionLabel: "15", carNumber: 55, driverName: "Carlos Sainz", team: "Williams", lapsCompleted: 56, result: "+2 laps", points: 0 },
    { positionLabel: "16", carNumber: 11, driverName: "Sergio Perez", team: "Cadillac", lapsCompleted: 55, result: "+3 laps", points: 0 },
    { positionLabel: "NC", carNumber: 18, driverName: "Lance Stroll", team: "Aston Martin", lapsCompleted: 43, result: "+15 laps", points: 0 },
    { positionLabel: "NC", carNumber: 14, driverName: "Fernando Alonso", team: "Aston Martin", lapsCompleted: 21, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 77, driverName: "Valtteri Bottas", team: "Cadillac", lapsCompleted: 15, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 6, driverName: "Isack Hadjar", team: "Red Bull Racing", lapsCompleted: 10, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 81, driverName: "Oscar Piastri", team: "McLaren", lapsCompleted: 0, result: "DNS", points: 0 },
    { positionLabel: "NC", carNumber: 27, driverName: "Nico Hulkenberg", team: "Audi", lapsCompleted: 0, result: "DNS", points: 0 },
  ],
  102: [
    { positionLabel: "1", carNumber: 12, driverName: "Kimi Antonelli", team: "Mercedes", lapsCompleted: 56, result: "1:33:15.607", points: 25 },
    { positionLabel: "2", carNumber: 63, driverName: "George Russell", team: "Mercedes", lapsCompleted: 56, result: "+5.515s", points: 18 },
    { positionLabel: "3", carNumber: 44, driverName: "Lewis Hamilton", team: "Ferrari", lapsCompleted: 56, result: "+25.267s", points: 15 },
    { positionLabel: "4", carNumber: 16, driverName: "Charles Leclerc", team: "Ferrari", lapsCompleted: 56, result: "+28.894s", points: 12 },
    { positionLabel: "5", carNumber: 87, driverName: "Oliver Bearman", team: "Haas F1 Team", lapsCompleted: 56, result: "+57.268s", points: 10 },
    { positionLabel: "6", carNumber: 10, driverName: "Pierre Gasly", team: "Alpine", lapsCompleted: 56, result: "+59.647s", points: 8 },
    { positionLabel: "7", carNumber: 30, driverName: "Liam Lawson", team: "Racing Bulls", lapsCompleted: 56, result: "+80.588s", points: 6 },
    { positionLabel: "8", carNumber: 6, driverName: "Isack Hadjar", team: "Red Bull Racing", lapsCompleted: 56, result: "+87.247s", points: 4 },
    { positionLabel: "9", carNumber: 55, driverName: "Carlos Sainz", team: "Williams", lapsCompleted: 55, result: "+1 lap", points: 2 },
    { positionLabel: "10", carNumber: 43, driverName: "Franco Colapinto", team: "Alpine", lapsCompleted: 55, result: "+1 lap", points: 1 },
    { positionLabel: "11", carNumber: 27, driverName: "Nico Hulkenberg", team: "Audi", lapsCompleted: 55, result: "+1 lap", points: 0 },
    { positionLabel: "12", carNumber: 41, driverName: "Arvid Lindblad", team: "Racing Bulls", lapsCompleted: 55, result: "+1 lap", points: 0 },
    { positionLabel: "13", carNumber: 77, driverName: "Valtteri Bottas", team: "Cadillac", lapsCompleted: 55, result: "+1 lap", points: 0 },
    { positionLabel: "14", carNumber: 31, driverName: "Esteban Ocon", team: "Haas F1 Team", lapsCompleted: 55, result: "+1 lap", points: 0 },
    { positionLabel: "15", carNumber: 11, driverName: "Sergio Perez", team: "Cadillac", lapsCompleted: 55, result: "+1 lap", points: 0 },
    { positionLabel: "NC", carNumber: 3, driverName: "Max Verstappen", team: "Red Bull Racing", lapsCompleted: 45, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 14, driverName: "Fernando Alonso", team: "Aston Martin", lapsCompleted: 32, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 18, driverName: "Lance Stroll", team: "Aston Martin", lapsCompleted: 9, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 81, driverName: "Oscar Piastri", team: "McLaren", lapsCompleted: 0, result: "DNS", points: 0 },
    { positionLabel: "NC", carNumber: 1, driverName: "Lando Norris", team: "McLaren", lapsCompleted: 0, result: "DNS", points: 0 },
    { positionLabel: "NC", carNumber: 5, driverName: "Gabriel Bortoleto", team: "Audi", lapsCompleted: 0, result: "DNS", points: 0 },
    { positionLabel: "NC", carNumber: 23, driverName: "Alexander Albon", team: "Williams", lapsCompleted: 0, result: "DNS", points: 0 },
  ],
  103: [
    { positionLabel: "1", carNumber: 12, driverName: "Kimi Antonelli", team: "Mercedes", lapsCompleted: 53, result: "1:28:03.403", points: 25 },
    { positionLabel: "2", carNumber: 81, driverName: "Oscar Piastri", team: "McLaren", lapsCompleted: 53, result: "+13.722s", points: 18 },
    { positionLabel: "3", carNumber: 16, driverName: "Charles Leclerc", team: "Ferrari", lapsCompleted: 53, result: "+15.270s", points: 15 },
    { positionLabel: "4", carNumber: 63, driverName: "George Russell", team: "Mercedes", lapsCompleted: 53, result: "+15.754s", points: 12 },
    { positionLabel: "5", carNumber: 1, driverName: "Lando Norris", team: "McLaren", lapsCompleted: 53, result: "+23.479s", points: 10 },
    { positionLabel: "6", carNumber: 44, driverName: "Lewis Hamilton", team: "Ferrari", lapsCompleted: 53, result: "+25.037s", points: 8 },
    { positionLabel: "7", carNumber: 10, driverName: "Pierre Gasly", team: "Alpine", lapsCompleted: 53, result: "+32.340s", points: 6 },
    { positionLabel: "8", carNumber: 3, driverName: "Max Verstappen", team: "Red Bull Racing", lapsCompleted: 53, result: "+32.677s", points: 4 },
    { positionLabel: "9", carNumber: 30, driverName: "Liam Lawson", team: "Racing Bulls", lapsCompleted: 53, result: "+50.180s", points: 2 },
    { positionLabel: "10", carNumber: 31, driverName: "Esteban Ocon", team: "Haas F1 Team", lapsCompleted: 53, result: "+51.216s", points: 1 },
    { positionLabel: "11", carNumber: 27, driverName: "Nico Hulkenberg", team: "Audi", lapsCompleted: 53, result: "+52.280s", points: 0 },
    { positionLabel: "12", carNumber: 6, driverName: "Isack Hadjar", team: "Red Bull Racing", lapsCompleted: 53, result: "+56.154s", points: 0 },
    { positionLabel: "13", carNumber: 5, driverName: "Gabriel Bortoleto", team: "Audi", lapsCompleted: 53, result: "+59.078s", points: 0 },
    { positionLabel: "14", carNumber: 41, driverName: "Arvid Lindblad", team: "Racing Bulls", lapsCompleted: 53, result: "+59.848s", points: 0 },
    { positionLabel: "15", carNumber: 55, driverName: "Carlos Sainz", team: "Williams", lapsCompleted: 53, result: "+65.008s", points: 0 },
    { positionLabel: "16", carNumber: 43, driverName: "Franco Colapinto", team: "Alpine", lapsCompleted: 53, result: "+65.773s", points: 0 },
    { positionLabel: "17", carNumber: 11, driverName: "Sergio Perez", team: "Cadillac", lapsCompleted: 53, result: "+92.453s", points: 0 },
    { positionLabel: "18", carNumber: 14, driverName: "Fernando Alonso", team: "Aston Martin", lapsCompleted: 52, result: "+1 lap", points: 0 },
    { positionLabel: "19", carNumber: 77, driverName: "Valtteri Bottas", team: "Cadillac", lapsCompleted: 52, result: "+1 lap", points: 0 },
    { positionLabel: "20", carNumber: 23, driverName: "Alexander Albon", team: "Williams", lapsCompleted: 51, result: "+2 laps", points: 0 },
    { positionLabel: "NC", carNumber: 18, driverName: "Lance Stroll", team: "Aston Martin", lapsCompleted: 30, result: "DNF", points: 0 },
    { positionLabel: "NC", carNumber: 87, driverName: "Oliver Bearman", team: "Haas F1 Team", lapsCompleted: 20, result: "DNF", points: 0 },
  ],
};