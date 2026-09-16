// Theme Engine mapped cleanly to existing public media files
export interface ThemeMedia {
  type: "video" | "image";
  src: string;
  urlPath: string;
}

// Map of exact files that exist in public/day-themes and public/night-themes
const THEME_FILES: Record<string, Record<string, string[]>> = {
  day: {
    "badai-petir": ["1.webm", "2.webm"],
    berangin: ["1.webm", "2.webm"],
    berawan: ["1.webp", "2.webp", "3.webm", "4.webm"],
    cerah: ["1.webm", "2.webm"],
    hujan: ["1.webm", "2.webm", "3.webm", "4.webp"],
    kabut: ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp"],
    random: ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp"],
    salju: ["1.webp", "2.webp", "3.webp"],
    "sebagian-berawan": [
      "1.webm",
      "2.webm",
      "3.webm",
      "4.webm",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
    ],
  },
  night: {
    "badai-petir": ["1.webm", "2.webm"],
    berangin: ["1.webm"],
    berawan: ["1.webm"],
    cerah: [
      "1.webm",
      "2.webm",
      "3.webm",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
    ],
    hujan: ["1.webm", "2.webm", "3.webp"],
    kabut: ["1.webp"],
    random: ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp"],
    salju: ["1.webp", "2.webp", "3.webp"],
    "sebagian-berawan": [
      "1.webm",
      "2.webm",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
    ],
  },
};

export function getCategoryByCondition(condition: string): string {
  const cuaca = condition.toLowerCase();
  if (cuaca.includes("thunder")) return "badai-petir";
  if (cuaca.includes("snow")) return "salju";
  if (cuaca.includes("rain") || cuaca.includes("showers")) return "hujan";
  if (cuaca.includes("clear")) return "cerah";
  if (cuaca.includes("cloudy") && cuaca.includes("partly")) return "sebagian-berawan";
  if (cuaca.includes("cloudy")) return "berawan";
  if (cuaca.includes("fog")) return "kabut";
  if (cuaca.includes("wind")) return "berangin";
  return "random";
}

export function isDayTime(
  currentTime: string,
  sunriseTime: string,
  sunsetTime: string
): boolean {
  if (!currentTime || !sunriseTime || !sunsetTime) return true;
  // Standard format comparison (HH:mm)
  return currentTime >= sunriseTime && currentTime < sunsetTime;
}

export function resolveThemeMedia(
  condition: string,
  isDay: boolean
): ThemeMedia {
  const timeKey = isDay ? "day" : "night";
  const folderName = isDay ? "day-themes" : "night-themes";
  const category = getCategoryByCondition(condition);

  const availableFiles =
    THEME_FILES[timeKey]?.[category] || THEME_FILES[timeKey]["random"];
  const selectedFile =
    availableFiles[Math.floor(Math.random() * availableFiles.length)] || "1.webp";

  const isVideo = selectedFile.endsWith(".webm");
  const fullPath = `/${folderName}/${category}/${selectedFile}`;

  return {
    type: isVideo ? "video" : "image",
    src: fullPath,
    urlPath: fullPath,
  };
}
