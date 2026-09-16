import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WeatherResponseData, DayForecastItem, WeatherItem } from "@/lib/types";
import { getMockWeatherData } from "@/lib/mockData";

// Simple in-memory cache: city -> { data, expiry }
interface CacheEntry {
  data: WeatherResponseData;
  expiry: number;
}
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function formatLocalDateTime(
  epochSeconds: number,
  timeZone: string,
  options: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(epochSeconds * 1000);
    return date.toLocaleString("id-ID", { timeZone, ...options });
  } catch {
    const date = new Date(epochSeconds * 1000);
    return date.toLocaleString("id-ID", options);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = (searchParams.get("city") || "sukabumi").trim();
  const cacheKey = city.toLowerCase();

  // 1. Check in-memory cache
  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({
      success: true,
      source: "cache",
      data: cached.data,
    });
  }

  const apiKey =
    process.env.VISUAL_CROSSING_API_KEY || "TY6AA7XBHB3Z6PHMYUEKRBH6T";
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    city
  )}/next7days?unitGroup=metric&key=${apiKey}&iconSet=icons2`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 1800 }, // Next.js fetch cache 30 mins
    });

    if (!res.ok) {
      console.warn(
        `Visual Crossing API responded with status ${res.status}. Falling back to mock data.`
      );
      const fallbackData = getMockWeatherData(city);
      return NextResponse.json({
        success: true,
        source: "fallback",
        data: fallbackData,
      });
    }

    const data = await res.json();
    const resolvedAddress = data.resolvedAddress || city;
    const timezone = data.timezone || "Asia/Jakarta";

    const currentConditions = data.currentConditions || {};
    const currentEpoch = currentConditions.datetimeEpoch || Math.floor(Date.now() / 1000);

    const current: WeatherItem = {
      wilayah: resolvedAddress,
      timestamp: currentEpoch,
      timezone: timezone,
      cuaca: currentConditions.conditions || "Clear",
      suhu: Math.round(currentConditions.temp ?? 28),
      icon: currentConditions.icon || "cloudy",
      kelembapan: Math.round(currentConditions.humidity ?? 80),
      angin: Math.round(currentConditions.windspeed ?? 10),
      tekanan: Math.round(currentConditions.pressure ?? 1010),
      sunriseTime: currentConditions.sunrise || "05:45",
      sunsetTime: currentConditions.sunset || "17:55",
      currentTime: formatLocalDateTime(currentEpoch, timezone, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      longDate: formatLocalDateTime(currentEpoch, timezone, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      shortDate: formatLocalDateTime(currentEpoch, timezone, {
        day: "numeric",
        month: "short",
      }),
    };

    const days: DayForecastItem[] = [];
    const allHourlyTemps: number[][] = [];
    const dayDates: string[] = [];

    const numDays = Math.min(data.days?.length || 0, 7);

    for (let i = 0; i < numDays; i++) {
      const dayRaw = data.days[i];
      const hours: WeatherItem[] = [];
      const dayTempList: number[] = [];

      const numHours = Math.min(dayRaw.hours?.length || 0, 24);

      for (let j = 0; j < numHours; j++) {
        const hourRaw = dayRaw.hours[j];
        const hourEpoch = hourRaw.datetimeEpoch;

        const hourItem: WeatherItem = {
          wilayah: resolvedAddress,
          timestamp: hourEpoch,
          timezone: timezone,
          icon: hourRaw.icon || "cloudy",
          suhu: Math.round(hourRaw.temp ?? 25),
          cuaca: hourRaw.conditions || "Cloudy",
          kelembapan: Math.round(hourRaw.humidity ?? 80),
          angin: Math.round(hourRaw.windspeed ?? 10),
          tekanan: Math.round(hourRaw.pressure ?? 1010),
          sunriseTime: dayRaw.sunrise || "05:45",
          sunsetTime: dayRaw.sunset || "17:55",
          currentTime: formatLocalDateTime(hourEpoch, timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          longDate: formatLocalDateTime(hourEpoch, timezone, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          shortDate: formatLocalDateTime(hourEpoch, timezone, {
            day: "numeric",
            month: "short",
          }),
        };

        hours.push(hourItem);
        dayTempList.push(hourItem.suhu);
      }

      const dayShortDate =
        hours.length > 0
          ? hours[0].shortDate
          : formatLocalDateTime(dayRaw.datetimeEpoch, timezone, {
              day: "numeric",
              month: "short",
            });

      dayDates.push(dayShortDate);
      allHourlyTemps.push(dayTempList);

      days.push({
        index: i,
        tanggal: dayShortDate,
        icon: dayRaw.icon || "partly-cloudy-day",
        tempMin: Math.round(dayRaw.tempmin ?? 22),
        tempMax: Math.round(dayRaw.tempmax ?? 32),
        description: dayRaw.description || "No weather description available.",
        hours,
      });
    }

    const result: WeatherResponseData = {
      resolvedAddress,
      current,
      days,
      allHourlyTemps,
      dayDates,
    };

    // Save to in-memory cache
    weatherCache.set(cacheKey, {
      data: result,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    // Save search history asynchronously to SQLite via Prisma
    prisma.searchHistory
      .create({
        data: {
          query: city,
          resolvedAddress,
          temp: current.suhu,
          conditions: current.cuaca,
        },
      })
      .catch((err) => {
        console.error("Failed to save search history to DB:", err.message);
      });

    return NextResponse.json({
      success: true,
      source: "api",
      data: result,
    });
  } catch (err: any) {
    console.error("Error fetching weather API:", err?.message);
    const fallbackData = getMockWeatherData(city);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: fallbackData,
    });
  }
}
