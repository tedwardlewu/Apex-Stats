export interface NewsItem {
  id: string;
  fileName: string;
  title: string;
  description: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "chinese-gp-results",
    fileName: "Chinese GP Results.png",
    title: "Chinese Grand Prix 2026 points scorers",
    description: "Drivers scoring points during this race weekend.",
  },
  {
    id: "kimi-grand-slam",
    fileName: "Kimi Grand Slam.png",
    title: "Kimi Antonelli Hat Trick",
    description: "Kimi Antonelli achieved Hat Trick at the Chinese GP, dominating the weekend with pole position, win and the fastest lap. If he had led every lap since the start, it would have been a Grand Slam for the young Italian driver.",
  },
  {
    id: "kimi-feature",
    fileName: "Kimi.png",
    title: "Kimi Antonelli First Every Formula 1 Victory",
    description: "Kimi Antonelli achieved his first Formula 1 victory at the Chinese GP, marking a significant milestone in his career. Hopefully this will be one of many wins to come.",
  },
  {
    id: "lewis-podium",
    fileName: "Lewis Podium.png",
    title: "Lewis Hamilton first Ferrari Podium",
    description: "Ferrari driver Lewis Hamilton achieved his first podium for the Italian team, finishing 3rd for the Scuderia at the Chinese GP, securing third place behind his former team mate George Russell. This marks a promising start to his tenure with Ferrari, which began with a year of podium drought in 2025.",
  },
  {
    id: "chinese-gp-podium",
    fileName: "Podium Chinese GP.png",
    title: "Podium at the Chinese GP",
    description: "Three Mercedes drivers on the podium at the Chinese GP, Toto must be very happy.",
  },
];