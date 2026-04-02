export interface NewsItem {
  id: string;
  fileName: string;
  fileNames?: string[];
  title: string;
  description: string;
  objectPosition?: string;
  objectFit?: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "stroll-gt3-debut",
    fileName: "Stroll GT3.jpg",
    fileNames: ["Stroll GT3 1.webp", "Stroll GT3.jpg"],
    title: " Lance Stroll makes GT3 debut with Aston Martin",
    description: "Aston Martin's Lance Stroll to make his first GT3 debut at Paul Ricard for the six-hour night event behind the wheel of one of seven Aston Martin Vantage GT3 cars in the field."
  },
  {
    id: "japan-kimi-2026",
    fileName: "Kimi Japan Win.jpg",
    fileNames: ["Kimi Japan Win.jpg", "Kimi Wins.png"],
    objectPosition: "center 0%",
    title: "Kimi Antonelli wins the Japanese Grand Prix 2026",
    description: "KIMIT WINS AGAIN! Kimi Antonelli secured another victory at the Japanese Grand Prix, securing his second win of the season at Suzuka Circuit. The young Mercedes driver showcased his talent and consistency, now leading the drivers championship with 72 points, 9 points ahead of his teammate George Russell. This victory solidifies Antonelli's position as a strong contender for the championship title this season.",
  },
  {
    id: "japan-results-2026",
    fileName: "Japan Results.png",
    title: "Japanese Grand Prix 2026 - Full Results",
    description: "The Japanese Grand Prix 2026 concluded with a thrilling race at Suzuka Circuit. Kimi Antonelli secured his second victory, with Oscar Piastri finishing in second place and Charles Leclerc in third.",
  },
  {
    id: "japan-max-out-2026",
    fileName: "Max Japan.avif",
    title: "Max Verstappen Q2 exit in Japan",
    description: "Max Verstappen disappointed after a Q2 exit in Japan, the Red Bull driver expressed his frustration with the car that has been present ever since the start of the season. If things keep going like this he might considering an exist out of F1."
  },
  {
    id: "japan-qualifying-kimi-2026",
    fileName: "Japan Qualifying.avif",
    fileNames: ["Japan Qualifying.avif", "Japan Start.webp", "Kimi Japan.avif"],
    title: "Kimi Antonelli shines through dramatic Japanese Grand Prix qualifying",
    description: "A tense Suzuka qualifying session set the grid for the Japanese Grand Prix, with Kimi Antonelli emerging as one of the standout names of the weekend. From the opening laps to the final moments on Saturday, the young Mercedes driver looked sharp as the field battled changing grip and razor-thin margins. This is his second consective pole position after China. ",
  },
  {
    id: "fp3-japan-2026",
    fileName: "FP3 Japan.jpg",
    title: "Free Practice 3 - Japanese Grand Prix 2026",
    description: "Free Practice 3 session underway at Suzuka Circuit for the 2026 Japanese Grand Prix. Teams and drivers are making final adjustments to their setups ahead of qualifying.",
  },
  {
    id: "fp2-japan-2026",
    fileName: "Fp2 Japan.webp",
    fileNames: ["Fp2 Japan.webp", "Fp2 Japan2.jpg"],
    title: "Free Practice 2 - Japanese Grand Prix 2026",
    description: "Free Practice 2 session at Suzuka Circuit. Teams are fine-tuning their setups and gathering data ahead of qualifying.",
  },
  {
    id: "fp1-japan-2026",
    fileName: "FP1 Japan.webp",
    title: "Free Practice 1 - Japanese Grand Prix 2026",
    description: "Free Practice 1 session underway at Suzuka Circuit for the 2026 Japanese Grand Prix. Teams and drivers are getting their first taste of track conditions for the weekend.",
  },
  {
    id: "Mercedes-AMG Petronas F1 Team announces new wolf-inspired livery change for Japanese Grand Prix",
    fileName: "Mercedes.avif",
    title: "Mercedes-AMG Petronas F1 Team announces new wolf-inspired livery change for Japanese Grand Prix",
    description: "Mercedes-AMG Petronas F1 Team has unveiled a new wolf-inspired livery for the upcoming Japanese Grand Prix. The design features a sleek combination of silver, black and turquoise, with intricate details inspired by the team's iconic logo. This matches an on-going theme of wolf-inspired merchandise and branding for the team, which has been well received by fans. ",
  },
  {
    id: "Jak Crawford will take part in the opening practice session at the Japanese Grand Prix",
    fileName: "Crawford.avif",
    title: "Jak Crawford to take part in the opening practice session at the Japanese Grand Prix",
    description: "Aston Martin has announced that Jak Crawford will take part in the opening practice session at the Japanese Grand Prix, replacing Alonso at the FP1 session. American racer Crawford, 20, finished runner-up to now McLaren junior Leonardo Fornaroli in Formula 2 last season, having previously won races at F3 and F4 level.",
  },
  {
    id: "HAAS F1 Team announces special Godzilla themed livery for the Japanese Grand Prix",
    fileName: "HAAS.avif",
    title: "HAAS F1 Team announces special Godzilla themed livery for the Japanese Grand Prix",
    description: "HAAS F1 Team has unveiled a special Godzilla themed livery for the upcoming Japanese Grand Prix. The design features a striking combination of red, white and black, with intricate details inspired by the iconic monster. The team hopes that the new livery will bring them good luck at Suzuka.",
  },
  {
    id: "Max Verstappen disqualified from Nurburgrin GT3 Race",
    fileName: "Max DSQ.avif",
    title: "Max Verstappen disqualified from Nurburgrin GT3 Race",
    description: "Max Verstappen was disqualified from the Nurburgrin GT3 Race after another win around the track due to using 1 more set of tires during the 4-hour-race. He won by a margin of 1 minute and 30 seconds, but the disqualification means that the victory will be awarded to the second-place finisher, who was 1 minute and 45 seconds behind Verstappen.",
  },
  {
    id: "Racing Bulls introduces special livery for Japanese Grand Prix",
    fileName: "RB Japan.avif",
    title: "Racing Bulls introduces special livery for Japanese Grand Prix",
    description: "Racing Bulls unveiled a striking new livery for the Japanese Grand Prix, featuring a bold red and black design with intricate patterns inspired by traditional Japanese art. The team hopes the new look will bring them good fortune at Suzuka.",
  },
  {
    id: "Mercedes-AMG Petronas F1 Team appoints Bradley Lord as new Deputy Team Principal",
    fileName: "Bradley.avif",
    title: "Mercedes-AMG Petronas F1 Team appoints Bradley Lord as new Deputy Team Principal",
    description: "Mercedes-AMG Petronas F1 Team has announced the appointment of Bradley Lord as the new Deputy Team Principal. Lord, who has been with the team since 2017, will work closely with Team Principal Toto Wolff to lead the team in their pursuit of championship success.",
  },
  {
    id: "Jonathan Wheatley will depart from Team Principle role at Audi F1 Team with immediate effect",
    fileName: "Jonathan.jpg",
    title: "Audi F1 Team Jonathan Wheatley Departure",
    description: "Audi F1 Team announced that Jonathan Wheatley will depart from his role as Team Principle with immediate effect. The team has not yet announced a replacement for the experienced motorsport manager, who has been with the team since its inception.",
  },
  {
    id: "Adrian Newey steps down from team principle role at Aston Martin F1 Team",
    fileName: "Adrian.webp",
    title: "Aston Martin F1 Team Adrian Newey steps down as Team Principle",
    description: "Aston Martin F1 Team announced that Adrian Newey will step down from his role as Team Principle. The legendary designer and engineer, known for his work with multiple championship-winning teams, will be replaced by current Technical Director Dan Fallows. Newey will continue to serve as Chief Technical Officer, focusing on the team's long-term technical strategy, will be focusing more on a technical role.",
  },
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
    title: "Kimi Antonelli First Formula 1 Victory",
    description: "KIMI WINS AT CHINA! Mercedes Driver Kimi Antonelli achieved his first Formula 1 victory at the Chinese GP, marking a significant milestone in his career. Hopefully this will be one of many wins to come.",
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