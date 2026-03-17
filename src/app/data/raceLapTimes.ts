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
  
};