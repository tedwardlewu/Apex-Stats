export interface UpcomingRaceContext {
  season: string;
  name: string;
  country: string;
  circuit: string;
  date: string;
  summary: string;
  modelFocus: string;
  teamBiases: Record<string, number>;
}

export const upcomingRaceBySeason: Record<string, UpcomingRaceContext> = {
  "2025": {
    season: "2025",
    name: "Abu Dhabi Grand Prix",
    country: "Abu Dhabi, United Arab Emirates",
    circuit: "Yas Marina Circuit",
    date: "2025-12-07",
    summary: "A smooth traction-heavy finale where clean exits and strong qualifying pace usually decide the front of the field.",
    modelFocus: "Current points pace, team efficiency, and recent consistency are weighted slightly above outright championship pedigree.",
    teamBiases: {
      McLaren: 1.06,
      Mercedes: 1.03,
      "Red Bull Racing": 1.02,
      Ferrari: 1.01,
      Williams: 0.99,
      "Racing Bulls": 0.97,
      "Aston Martin": 0.96,
      "Haas F1 Team": 0.95,
      Sauber: 0.94,
      Alpine: 0.93,
    },
  },
  "2026": {
    season: "2026",
    name: "Miami Grand Prix",
    country: "Miami, USA",
    circuit: "Miami International Autodrome",
    date: "2026-05-01",
    summary: "A fast, technical street circuit with a mix of long straights and tight corners, rewarding top speed and traction.",
    modelFocus: "Recent qualifying pace and tire management are weighted above outright championship form.",
    teamBiases: {
      Mercedes: 1.06,
      Ferrari: 1.04,
      McLaren: 1.02,
      "Red Bull Racing": 1.03,
      "Haas F1 Team": 0.99,
      "Racing Bulls": 0.98,
      Alpine: 0.97,
      Audi: 0.96,
      Williams: 0.95,
      Cadillac: 0.92,
      "Aston Martin": 0.93,
    },
  },
};