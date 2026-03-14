import type { CSSProperties } from "react";

const funnyDriverImages: Record<string, string> = {
  "alexander albon": "/Funny Drivers/Albon.webp",
  "fernando alonso": "/Funny Drivers/Alonso.webp",
  "arvid lindblad": "/Funny Drivers/Arvid.avif",
  "oliver bearman": "/Funny Drivers/Bearman.jpg",
  "valtteri bottas": "/Funny Drivers/Bottas.jpg",
  "carlos sainz": "/Funny Drivers/Carlos.jpg",
  "carlos sainz jr": "/Funny Drivers/Carlos.jpg",
  "charles leclerc": "/Funny Drivers/Charles.webp",
  "franco colapinto": "/Funny Drivers/Franco.webp",
  "gabriel bortoleto": "/Funny Drivers/Garbiel.png",
  "pierre gasly": "/Funny Drivers/Gasly.jpg",
  "george russell": "/Funny Drivers/George.jpg",
  "isack hadjar": "/Funny Drivers/Isac.png",
  "kimi antonelli": "/Funny Drivers/Kimi.jpg",
  "lando norris": "/Funny Drivers/Lando.jpg",
  "liam lawson": "/Funny Drivers/Lawson.jpg",
  "lewis hamilton": "/Funny Drivers/Hamilton.png",
  "max verstappen": "/Funny Drivers/Max.jpeg",
  "nico hulkenberg": "/Funny Drivers/Nico.jpg",
  "esteban ocon": "/Funny Drivers/Ocon.jpg",
  "oscar piastri": "/Funny Drivers/Oscar.jpg",
  "sergio perez": "/Funny Drivers/Perez.jpg",
  "lance stroll": "/Funny Drivers/Stroll.webp",
};

function normalizeDriverName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const memeDriverImageStyles: Record<string, CSSProperties> = {
  "alexander albon": {
    transform: "scale(1.24)",
    transformOrigin: "center 36%",
  },
  "fernando alonso": {
    transform: "translateY(-6%) scale(1.14)",
    transformOrigin: "center 28%",
  },
  "george russell": {
    transform: "scale(1.18)",
    transformOrigin: "center 32%",
  },
  "lewis hamilton": {
    transform: "scale(0.92)",
    transformOrigin: "center 34%",
  },
  "kimi antonelli": {
    transform: "scale(1.22)",
    transformOrigin: "center 34%",
  },
  "nico hulkenberg": {
    transform: "scale(1.28)",
    transformOrigin: "center 24%",
  },
  "oscar piastri": {
    transform: "scale(1.16)",
    transformOrigin: "center 32%",
  },
  "pierre gasly": {
    transform: "scale(1.18)",
    transformOrigin: "center 30%",
  },
};

export function getDriverImage(name: string, defaultImage: string, memeify: boolean) {
  if (!memeify) {
    return defaultImage;
  }

  return funnyDriverImages[normalizeDriverName(name)] ?? defaultImage;
}

export function getDriverImageStyle(name: string, memeify: boolean): CSSProperties | undefined {
  if (!memeify) {
    return undefined;
  }

  return memeDriverImageStyles[normalizeDriverName(name)];
}