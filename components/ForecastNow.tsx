"use client";

import React from "react";
import { WeatherItem } from "@/lib/types";

interface ForecastNowProps {
  data: WeatherItem;
}

export default function ForecastNow({ data }: ForecastNowProps) {
  return (
    <div className="forecast-now">
      <div className="left">
        <div className="time" id="time">
          {data.currentTime}
        </div>
        <div className="wilayah" id="wilayah">
          {data.wilayah}
        </div>
        <div className="date" id="date">
          {data.longDate}
        </div>
      </div>

      <div className="weather-info">
        <div className="suhu">
          <span className="angka" id="suhu">
            {data.suhu}
          </span>
          <span className="degree">°C</span>
        </div>
        <div className="cuaca">
          <img
            id="icon-cuaca"
            src={`/asset/weather-icon/${data.icon}.svg`}
            alt={data.cuaca}
            onError={(e) => {
              // Fallback icon if specific SVG name differs
              (e.target as HTMLImageElement).src = "/asset/weather-icon/cloudy.svg";
            }}
          />
          <p id="cuaca">{data.cuaca}</p>
        </div>
      </div>

      <div className="detail-info">
        <div className="humidity">
          <img
            className="detail-info-icon"
            src="/asset/humidity.png"
            alt="Humidity"
          />
          <div>
            <div className="name">Humidity</div>
            <div className="value" id="humidity">
              {data.kelembapan}%
            </div>
          </div>
        </div>

        <div className="wind">
          <img className="detail-info-icon" src="/asset/wind.png" alt="Wind" />
          <div>
            <div className="name">Wind Speed</div>
            <div className="value" id="wind">
              {data.angin}km/h
            </div>
          </div>
        </div>

        <div className="pressure">
          <img
            className="detail-info-icon"
            src="/asset/pressure.png"
            alt="Pressure"
          />
          <div>
            <div className="name">Pressure</div>
            <div className="value" id="pressure">
              {data.tekanan} hPa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
