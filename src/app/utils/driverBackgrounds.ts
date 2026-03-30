const driverBackgroundImages: Record<string, string> = {
  "alexander albon": "/Driver Backgrounds/Albon.jpg",
  "fernando alonso": "/Driver Backgrounds/Alonso.jpg",
  "arvid lindblad": "/Driver Backgrounds/Arvid.avif",
  "oliver bearman": "/Driver Backgrounds/Oliver.jpg",
  "valtteri bottas": "/Driver Backgrounds/Bottas.jpg",
  "carlos sainz": "/Driver Backgrounds/Carlos.jpg",
  "carlos sainz jr": "/Driver Backgrounds/Carlos.jpg",
  "charles leclerc": "/Driver Backgrounds/Charles.webp",
  "franco colapinto": "/Driver Backgrounds/Franco.jpg",
  "gabriel bortoleto": "/Driver Backgrounds/Gortoleto.jpg",
  "pierre gasly": "/Driver Backgrounds/Gasly.jpg",
  "george russell": "/Driver Backgrounds/Russel.webp",
  "isack hadjar": "/Driver Backgrounds/Hadjar.jpg",
  "kimi antonelli": "/Driver Backgrounds/Kimi.jpeg",
  "lando norris": "/Driver Backgrounds/Lando.avif",
  "liam lawson": "/Driver Backgrounds/Lawson.jpg",
  "lewis hamilton": "/Driver Backgrounds/Lewis.jpg",
  "max verstappen": "/Driver Backgrounds/Max.jpg",
  "nico hulkenberg": "/Driver Backgrounds/Nico.jpg",
  "esteban ocon": "/Driver Backgrounds/Ocon.avif",
  "oscar piastri": "/Driver Backgrounds/Oscar.avif",
  "sergio perez": "/Driver Backgrounds/Perez.png",
  "lance stroll": "/Driver Backgrounds/Stroll.jpg",
};

const driverBackgroundPositions: Record<string, string> = {
  "charles leclerc": "15% 16%",
  "lance stroll": "right 22%",
  "pierre gasly": "40% 100%",
};

const driverBackgroundSizes: Record<string, string> = {
  "pierre gasly": "220%",
  "max verstappen": "150%",
};

function normalizeDriverName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getDriverBackgroundImage(name: string, fallback: string) {
  return driverBackgroundImages[normalizeDriverName(name)] ?? fallback;
}

export function getDriverBackgroundPosition(name: string) {
  return driverBackgroundPositions[normalizeDriverName(name)] ?? "center 16%";
}

export function getDriverBackgroundSize(name: string) {
  return driverBackgroundSizes[normalizeDriverName(name)] ?? "cover";
}
