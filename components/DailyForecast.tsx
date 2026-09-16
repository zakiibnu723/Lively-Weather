"use client";

import React from "react";
import { DayForecastItem } from "@/lib/types";

interface DailyForecastProps {
  days: DayForecastItem[];
  activeDayIndex: number;
  onSelectDay: (index: number) => void;
}

export default function DailyForecast({
  days,
  activeDayIndex,
  onSelectDay,
}: DailyForecastProps) {
  const currentDay = days[activeDayIndex] || days[0];

  return (
    <div className="forecast-daily box">
      <div className="label">
        <p>Daily Forcast for 7 days</p>
      </div>

      <div className="forecast-desc">
        <span className="desc-label">Prediction:</span>
        <span className="desc-text">{currentDay?.description || ""}</span>
      </div>

      <div className="daycard-box">
        {days.slice(0, 7).map((day, index) => {
          const isClicked = activeDayIndex === index;
          return (
            <div
              key={index}
              id={`daycard${index}`}
              className={`daycard ${isClicked ? "clicked" : ""}`}
              onClick={() => onSelectDay(index)}
              role="button"
              tabIndex={0}
            >
              <div className="tanggal">{day.tanggal}</div>
              <div className="icon">
                <img
                  src={`/asset/weather-icon/${day.icon}.svg`}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/asset/weather-icon/partly-cloudy-day.svg";
                  }}
                />
              </div>
              <div className="daytemp">
                <div className="temp-min">{day.tempMin}°</div>
                <div className="temp-max">{day.tempMax}°</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
