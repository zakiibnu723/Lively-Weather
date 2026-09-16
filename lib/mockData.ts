import { WeatherResponseData, WeatherItem, DayForecastItem } from "./types";

export function getMockWeatherData(city: string = "Sukabumi"): WeatherResponseData {
  const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const now = new Date();
  const todayTimestamp = Math.floor(now.getTime() / 1000);

  const days: DayForecastItem[] = [];
  const allHourlyTemps: number[][] = [];
  const dayDates: string[] = [];

  const icons = [
    "partly-cloudy-day",
    "cloudy",
    "rain",
    "partly-cloudy-day",
    "clear-day",
    "rain",
    "partly-cloudy-day",
  ];
  const conditions = [
    "Partly Cloudy",
    "Overcast Cloudy",
    "Rain Showers",
    "Partly Cloudy",
    "Clear Sky",
    "Moderate Rain",
    "Mostly Sunny",
  ];
  const descriptions = [
    "Partly cloudy throughout the day with afternoon rain likely.",
    "Cloudy skies throughout the day with occasional drizzle.",
    "Rain showers expected starting from afternoon until evening.",
    "Scattered clouds throughout the day with pleasant temperatures.",
    "Clear skies and bright sun throughout the entire day.",
    "Light to moderate rainfall expected during midday.",
    "Partly cloudy with warm breeze in the morning and evening.",
  ];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const shortDate = dayDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    const longDate = dayDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    dayDates.push(shortDate);

    const baseTemp = 24 + Math.sin(i) * 3;
    const tempMin = Math.round(baseTemp - 3);
    const tempMax = Math.round(baseTemp + 7);

    const hours: WeatherItem[] = [];
    const hourlyTemp: number[] = [];

    for (let h = 0; h < 24; h++) {
      const hourTemp = Math.round(
        baseTemp + Math.sin(((h - 6) / 24) * 2 * Math.PI) * 5
      );
      hourlyTemp.push(hourTemp);

      const hourString = `${h.toString().padStart(2, "0")}:00`;
      hours.push({
        wilayah: `${normalizedCity}, West Java, Indonesia`,
        timestamp: todayTimestamp + i * 86400 + h * 3600,
        timezone: "Asia/Jakarta",
        cuaca: conditions[i],
        suhu: hourTemp,
        icon: icons[i],
        kelembapan: 75 + Math.round(Math.sin(h) * 15),
        angin: 12 + Math.round(Math.cos(h) * 5),
        tekanan: 1010 + Math.round(Math.sin(h) * 3),
        sunriseTime: "05:45",
        sunsetTime: "17:55",
        currentTime: hourString,
        longDate,
        shortDate,
      });
    }

    allHourlyTemps.push(hourlyTemp);

    days.push({
      index: i,
      tanggal: shortDate,
      icon: icons[i],
      tempMin,
      tempMax,
      description: descriptions[i],
      hours,
    });
  }

  const currentHour = now.getHours();
  const current: WeatherItem = {
    wilayah: `${normalizedCity}, West Java, Indonesia`,
    timestamp: todayTimestamp,
    timezone: "Asia/Jakarta",
    cuaca: conditions[0],
    suhu: allHourlyTemps[0][currentHour] || 27,
    icon: icons[0],
    kelembapan: 82,
    angin: 14,
    tekanan: 1009,
    sunriseTime: "05:45",
    sunsetTime: "17:55",
    currentTime: now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    longDate: now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    shortDate: now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
  };

  return {
    resolvedAddress: `${normalizedCity}, West Java, Indonesia`,
    current,
    days,
    allHourlyTemps,
    dayDates,
  };
}
