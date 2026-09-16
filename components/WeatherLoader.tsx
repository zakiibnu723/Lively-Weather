"use client";

import React from "react";

interface WeatherLoaderProps {
  isLoading: boolean;
  message?: string;
}

export default function WeatherLoader({
  isLoading,
  message = "Memperbarui Data Cuaca...",
}: WeatherLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="weather-loader-overlay">
      <div className="weather-loader-card">
        {/* Animated Weather Scene */}
        <div className="loader-scene">
          {/* Glowing Sun */}
          <div className="loader-sun">
            <div className="sun-core"></div>
            <div className="sun-rays"></div>
          </div>

          {/* Drifting Cloud */}
          <div className="loader-cloud">
            <svg viewBox="0 0 100 60" className="cloud-svg">
              <path
                d="M20 45 A15 15 0 0 1 35 22 A22 22 0 0 1 70 20 A18 18 0 0 1 85 45 Z"
                fill="rgba(255, 255, 255, 0.85)"
              />
            </svg>
          </div>

          {/* Falling Neon Raindrops */}
          <div className="loader-rain">
            <span className="raindrop d1"></span>
            <span className="raindrop d2"></span>
            <span className="raindrop d3"></span>
            <span className="raindrop d4"></span>
          </div>
        </div>

        {/* Status Text & Shimmer Bar */}
        <div className="loader-text-container">
          <p className="loader-title">{message}</p>
          <div className="loader-shimmer-track">
            <div className="loader-shimmer-thumb"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .weather-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 15, 26, 0.65);
          backdrop-filter: blur(14px) brightness(85%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease forwards;
        }

        .weather-loader-card {
          position: relative;
          background: rgba(25, 30, 45, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 30px 45px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(255, 234, 0, 0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          animation: floatCard 4s ease-in-out infinite;
        }

        .loader-scene {
          position: relative;
          width: 130px;
          height: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Sun Styles */
        .loader-sun {
          position: absolute;
          top: 10px;
          right: 25px;
          width: 44px;
          height: 44px;
        }

        .sun-core {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, #ffea00 0%, #ff9800 100%);
          border-radius: 50%;
          box-shadow: 0 0 25px #ffea00, 0 0 45px rgba(255, 152, 0, 0.6);
          animation: pulseSun 2.5s ease-in-out infinite alternate;
        }

        .sun-rays {
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border-radius: 50%;
          border: 2px dashed rgba(255, 234, 0, 0.7);
          animation: rotateRays 12s linear infinite;
        }

        /* Cloud Styles */
        .loader-cloud {
          position: absolute;
          left: 10px;
          bottom: 12px;
          width: 85px;
          height: 50px;
          z-index: 2;
          filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3));
          animation: driftCloud 3.5s ease-in-out infinite alternate;
        }

        .cloud-svg {
          width: 100%;
          height: 100%;
        }

        /* Rain Styles */
        .loader-rain {
          position: absolute;
          left: 28px;
          bottom: 2px;
          width: 50px;
          height: 25px;
          display: flex;
          justify-content: space-around;
          z-index: 1;
        }

        .raindrop {
          width: 2.5px;
          height: 10px;
          background: linear-gradient(
            to bottom,
            rgba(0, 234, 255, 0.2),
            rgba(0, 234, 255, 0.95)
          );
          border-radius: 2px;
          animation: dropRain 0.8s linear infinite;
        }

        .d1 {
          animation-delay: 0s;
        }
        .d2 {
          animation-delay: 0.2s;
        }
        .d3 {
          animation-delay: 0.4s;
        }
        .d4 {
          animation-delay: 0.6s;
        }

        /* Text & Shimmer Bar */
        .loader-text-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .loader-title {
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          animation: textPulse 2s ease-in-out infinite;
        }

        .loader-shimmer-track {
          width: 140px;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .loader-shimmer-thumb {
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            #ffea00,
            #00eaff,
            transparent
          );
          border-radius: 10px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* Keyframes */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulseSun {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 15px #ffea00, 0 0 30px rgba(255, 152, 0, 0.5);
          }
          100% {
            transform: scale(1.08);
            box-shadow: 0 0 30px #ffea00, 0 0 55px rgba(255, 152, 0, 0.8);
          }
        }

        @keyframes rotateRays {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes driftCloud {
          0% {
            transform: translateY(0px) translateX(-4px);
          }
          100% {
            transform: translateY(-5px) translateX(6px);
          }
        }

        @keyframes dropRain {
          0% {
            transform: translateY(-8px);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(18px);
            opacity: 0;
          }
        }

        @keyframes textPulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
