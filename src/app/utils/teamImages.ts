import type { CSSProperties } from "react";

const funnyTeamImages: Record<string, string> = {
  "alpine": "/Funny Teams/Alpine.webp",
  "aston martin": "/Funny Teams/Aston.webp",
  "audi": "/Funny Teams/Audi.jpg",
  "cadillac": "/Funny Teams/Cadillac.jpg",
  "ferrari": "/Funny Teams/Ferrari.jpg",
  "haas": "/Funny Teams/Haas.jpg",
  "haas f1 team": "/Funny Teams/Haas.jpg",
  "mclaren": "/Funny Teams/McLaren.jpg",
  "mercedes": "/Funny Teams/Mercedes.jpeg",
  "racing bulls": "/Funny Teams/Racingbulls.jpg",
  "red bull racing": "/Funny Teams/Redbull.webp",
  "williams": "/Funny Teams/Williams.jpg",
};

const memeTeamNames: Record<string, string> = {
  "alpine": "Flavio Briatore's French Racing Team",
  "aston martin": "Lawrence Stroll's Wallet",
  "audi": "Four Rings of Power",
  "cadillac": "Andretti F1",
  "ferrari": "The Clowns",
  "haas": "The Better American Team",
  "haas f1 team": "The Better American Team",
  "kick sauber": "Trash",
  "sauber": "Trash",
  "mclaren": "Papayas",
  "mercedes": "Silver Arrows",
  "rb": "Red Bull Junior Team",
  "racing bulls": "Red Bull Junior Team",
  "red bull racing": "Max Verstappen Racing",
  "williams": "Team Broke",
};

function normalizeTeamName(name: string) {
  return name.toLowerCase().trim();
}

const memeTeamImageStyles: Record<string, CSSProperties> = {
  "aston martin": {
    transform: "scale(1.08)",
    transformOrigin: "center center",
  },
  "ferrari": {
    transform: "translateY(-6%) scale(0.92)",
    transformOrigin: "center 42%",
  },
  "mclaren": {
    transform: "translateY(7%) scale(1.12)",
    transformOrigin: "center 58%",
  },
  "williams": {
    transform: "translateY(-5%) scale(1)",
    transformOrigin: "center 40%",
  },
};

export function getTeamImage(name: string, defaultImage: string, memeify: boolean) {
  if (!memeify) {
    return defaultImage;
  }

  return funnyTeamImages[normalizeTeamName(name)] ?? defaultImage;
}

export function getTeamImageStyle(name: string, memeify: boolean): CSSProperties | undefined {
  if (!memeify) {
    return undefined;
  }

  return memeTeamImageStyles[normalizeTeamName(name)];
}

export function getTeamDisplayName(name: string, memeify: boolean) {
  if (!memeify) {
    return name;
  }

  return memeTeamNames[normalizeTeamName(name)] ?? name;
}