"use client";

import React, { useState, useEffect, useCallback } from "react";
import Preloader from "@/components/Preloader";
import WeatherLoader from "@/components/WeatherLoader";
import BackgroundMedia from "@/components/BackgroundMedia";
import HeaderSection from "@/components/HeaderSection";
import ForecastNow from "@/components/ForecastNow";
import DailyForecast from "@/components/DailyForecast";
import HourlyChart from "@/components/HourlyChart";
import { WeatherResponseData, WeatherItem } from "@/lib/types";
import {
  ThemeMedia,
  resolveThemeMedia,
  isDayTime,
} from "@/lib/themeEngine";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponseData | null>(null);
  const [displayedWeather, setDisplayedWeather] = useState<WeatherItem | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Memuat Cuaca...");
  const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);
  const [themeMedia, setThemeMedia] = useState<ThemeMedia>({
    type: "image",
    src: "/day-themes/random/5.webp",
    urlPath: "/day-themes/random/5.webp",
  });

  const updateAppTheme = useCallback((item: WeatherItem) => {
    const isDay = isDayTime(item.currentTime, item.sunriseTime, item.sunsetTime);
    const media = resolveThemeMedia(item.icon || item.cuaca, isDay);
    setThemeMedia(media);
  }, []);

  const fetchWeather = useCallback(
    async (city: string) => {
      setIsLoading(true);
      setLoadingMessage(`Memuat Cuaca ${city}...`);
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const json = await res.json();
        if (json.success && json.data) {
          const data: WeatherResponseData = json.data;
          setWeatherData(data);
          setDisplayedWeather(data.current);
          setActiveDayIndex(0);
          updateAppTheme(data.current);
        }
      } catch (err) {
        console.error("Failed to load weather data:", err);
      } finally {
        // Small delay to ensure butter-smooth visual transition
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    },
    [updateAppTheme]
  );

  useEffect(() => {
    fetchWeather("sukabumi");
  }, [fetchWeather]);

  const handleSelectDay = (index: number) => {
    setActiveDayIndex(index);
  };

  const handleSelectHour = (hourIndex: number) => {
    if (!weatherData) return;
    const selectedDay = weatherData.days[activeDayIndex];
    if (selectedDay && selectedDay.hours[hourIndex]) {
      const selectedHourItem = selectedDay.hours[hourIndex];
      setDisplayedWeather(selectedHourItem);
      updateAppTheme(selectedHourItem);
    }
  };

  return (
    <>
      <BackgroundMedia
        media={themeMedia}
        onLoadingChange={setBackgroundLoading}
      />

      {displayedWeather && weatherData && (
        <div className="container">
          <HeaderSection onSearch={fetchWeather} isLoading={isLoading} />
          <ForecastNow data={displayedWeather} />
          <HourlyChart
            hourlyTemps={weatherData.allHourlyTemps[activeDayIndex] || []}
            activeDate={weatherData.dayDates[activeDayIndex] || ""}
            onSelectHour={handleSelectHour}
          />
          <DailyForecast
            days={weatherData.days}
            activeDayIndex={activeDayIndex}
            onSelectDay={handleSelectDay}
          />
        </div>
      )}

      {/* High-end Weather Scene Loader */}
      <WeatherLoader
        isLoading={isLoading || backgroundLoading}
        message={loadingMessage}
      />

      {/* Initial Page Preloader */}
      <Preloader />
    </>
  );
}
