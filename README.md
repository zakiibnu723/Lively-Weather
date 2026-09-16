# <h1><b>Lively Weather ⛅ (Next.js Fullstack Edition)</b></h1>

> **Lively Weather** is an atmospheric weather forecast application featuring dynamic reactive video/image background themes, interactive 7-day weather predictions, and a synchronized 24-hour hourly forecast chart.
> 
> *Originally created as a pure vanilla JavaScript project, this application has been upgraded into a modern, production-grade **Fullstack Next.js (App Router + TypeScript + Prisma ORM)** application while preserving 100% of the original visual design, animations, and glassmorphic UI.*

---

## 🚀 Key Improvements in the Fullstack Version

- **100% Pixel-Perfect Preservation**: The iconic glassmorphism layout, CSS Grid structure, custom SVG animated preloader, and dynamic video background switching are preserved without any visual changes.
- **Backend API Proxy & Security**: The Visual Crossing API key is completely protected on the server (`.env.local`). Client browsers never see or expose the API key.
- **Smart Caching & Rate-Limit Resilience**: In-memory and Next.js server-side caching (30-minute TTL) ensures identical location queries do not exhaust API quota. Includes automatic fallback mock data if the upstream provider encounters rate limits.
- **Prisma ORM & SQLite Database**: Seamlessly stores search history and favorite locations in a portable, zero-configuration local SQLite database (`dev.db`).
- **Clean Architecture & Type Safety**: Modular React components (`Preloader`, `BackgroundMedia`, `ForecastNow`, `DailyForecast`, `HourlyChart`) with complete TypeScript interfaces.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Chart.js (`react-chartjs-2`), Vanilla CSS & Glassmorphism
- **Backend / API**: Next.js Route Handlers (`/api/weather`, `/api/history`)
- **Database & ORM**: Prisma ORM with SQLite
- **Font**: Montserrat (via `next/font/google`)
- **Weather Data**: [Visual Crossing Weather API](https://www.visualcrossing.com/)

---

## 📁 Project Structure

```text
lively-weather/
├── app/
│   ├── api/
│   │   ├── weather/route.ts      # Backend weather proxy + server caching + fallback
│   │   └── history/route.ts      # Search history endpoint using Prisma
│   ├── layout.tsx                # Montserrat font setup & SEO metadata
│   ├── page.tsx                  # Main client controller & reactive state
│   └── globals.css               # Global CSS entry point
├── components/
│   ├── BackgroundLoader.tsx      # SVG loading indicator during background transitions
│   ├── BackgroundMedia.tsx       # Dynamic WebM video & WebP image atmospheric backdrop
│   ├── DailyForecast.tsx         # 7-day forecast cards with active day selection
│   ├── ForecastNow.tsx           # Hero weather display (temp, conditions, humidity, wind, pressure)
│   ├── HeaderSection.tsx         # Glassmorphic search bar & GitHub redirection link
│   ├── HourlyChart.tsx           # Interactive 24-hour temperature chart (Chart.js)
│   └── Preloader.tsx             # Signature SVG animated sun & rain preloader
├── lib/
│   ├── mockData.ts               # Offline/fallback weather dataset
│   ├── prisma.ts                 # Prisma Client singleton
│   ├── themeEngine.ts            # Clean theme resolution engine (Day/Night & 9 weather categories)
│   └── types.ts                  # TypeScript interfaces for all weather models
├── prisma/
│   ├── schema.prisma             # Database schema (SearchHistory, FavoriteLocation)
│   └── dev.db                    # Local SQLite database file
├── public/
│   ├── asset/                    # Weather icons (SVG) and metrics icons (PNG)
│   ├── day-themes/               # Daytime video (WebM) and image (WebP) themes
│   └── night-themes/             # Nighttime video (WebM) and image (WebP) themes
└── legacy/                       # Preserved original vanilla JavaScript & HTML files
```

---

## 🏃 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+

### 2. Installation
```bash
npm install
```

### 3. Database Setup (Prisma SQLite)
```bash
npx prisma db push
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Original Project History
The original Vanilla JS source files have been archived in the [`legacy/`](file:///d:/folder%20zaki/My%20coding%20File/All%20Project/WebDev/Competition%20Project/lively-weather/legacy) folder to showcase the evolution from a first learning project into a fullstack portfolio-grade application.
