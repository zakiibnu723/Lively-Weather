export interface WeatherItem {
  wilayah: string;
  timestamp: number;
  timezone: string;
  cuaca: string;
  suhu: number;
  icon: string;
  kelembapan: number;
  angin: number;
  tekanan: number;
  sunriseTime: string;
  sunsetTime: string;
  currentTime: string;
  longDate: string;
  shortDate: string;
}

export interface DayForecastItem {
  index: number;
  tanggal: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  description: string;
  hours: WeatherItem[];
}

export interface WeatherResponseData {
  resolvedAddress: string;
  current: WeatherItem;
  days: DayForecastItem[];
  allHourlyTemps: number[][]; // [dayIndex][hourIndex]
  dayDates: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  resolvedAddress: string;
  temp: number | null;
  conditions: string | null;
  createdAt: string;
}
