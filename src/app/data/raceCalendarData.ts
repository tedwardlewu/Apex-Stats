export interface CalendarRace {
  round: number;
  startDate: string;
  endDate: string;
  country: string;
  venue: string;
  sprint: boolean;
  cancelled?: boolean;
  note?: string;
}

export const raceCalendarBySeason: Record<string, CalendarRace[]> = {
  "2026": [
    { round: 1, startDate: "2026-03-06", endDate: "2026-03-08", country: "Australia", venue: "Melbourne", sprint: false },
    { round: 2, startDate: "2026-03-13", endDate: "2026-03-15", country: "China", venue: "Shanghai", sprint: true },
    { round: 3, startDate: "2026-03-27", endDate: "2026-03-29", country: "Japan", venue: "Suzuka", sprint: false },
    { round: 4, startDate: "2026-04-10", endDate: "2026-04-12", country: "Bahrain", venue: "Sakhir", sprint: false, cancelled: true },
    { round: 5, startDate: "2026-04-17", endDate: "2026-04-19", country: "Saudi Arabia", venue: "Jeddah", sprint: false, cancelled: true },
    { round: 6, startDate: "2026-05-01", endDate: "2026-05-03", country: "USA", venue: "Miami", sprint: true },
    { round: 7, startDate: "2026-05-22", endDate: "2026-05-24", country: "Canada", venue: "Montreal", sprint: true },
    { round: 8, startDate: "2026-06-05", endDate: "2026-06-07", country: "Monaco", venue: "Monaco", sprint: false },
    { round: 9, startDate: "2026-06-12", endDate: "2026-06-14", country: "Spain", venue: "Barcelona-Catalunya", sprint: false },
    { round: 10, startDate: "2026-06-26", endDate: "2026-06-28", country: "Austria", venue: "Spielberg", sprint: false },
    { round: 11, startDate: "2026-07-03", endDate: "2026-07-05", country: "Great Britain", venue: "Silverstone", sprint: true },
    { round: 12, startDate: "2026-07-17", endDate: "2026-07-19", country: "Belgium", venue: "Spa-Francorchamps", sprint: false },
    { round: 13, startDate: "2026-07-24", endDate: "2026-07-26", country: "Hungary", venue: "Budapest", sprint: false },
    { round: 14, startDate: "2026-08-21", endDate: "2026-08-23", country: "Netherlands", venue: "Zandvoort", sprint: true },
    { round: 15, startDate: "2026-09-04", endDate: "2026-09-06", country: "Italy", venue: "Monza", sprint: false },
    {
      round: 16,
      startDate: "2026-09-11",
      endDate: "2026-09-13",
      country: "Spain",
      venue: "Madrid",
      sprint: false,
      note: "Subject to FIA circuit homologation",
    },
    { round: 17, startDate: "2026-09-24", endDate: "2026-09-26", country: "Azerbaijan", venue: "Baku", sprint: false },
    { round: 18, startDate: "2026-10-09", endDate: "2026-10-11", country: "Singapore", venue: "Singapore", sprint: true },
    { round: 19, startDate: "2026-10-23", endDate: "2026-10-25", country: "USA", venue: "Austin", sprint: false },
    { round: 20, startDate: "2026-10-30", endDate: "2026-11-01", country: "Mexico", venue: "Mexico City", sprint: false },
    { round: 21, startDate: "2026-11-06", endDate: "2026-11-08", country: "Brazil", venue: "Sao Paulo", sprint: false },
    { round: 22, startDate: "2026-11-19", endDate: "2026-11-21", country: "USA", venue: "Las Vegas", sprint: false },
    { round: 23, startDate: "2026-11-27", endDate: "2026-11-29", country: "Qatar", venue: "Lusail", sprint: false },
    { round: 24, startDate: "2026-12-04", endDate: "2026-12-06", country: "Abu Dhabi", venue: "Yas Marina", sprint: false },
  ],
};
