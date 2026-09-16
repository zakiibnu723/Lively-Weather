"use client";

import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HourlyChartProps {
  hourlyTemps: number[];
  activeDate: string;
  onSelectHour: (hourIndex: number) => void;
}

const LABELS = [
  "00.00",
  "01.00",
  "02.00",
  "03.00",
  "04.00",
  "05.00",
  "06.00",
  "07.00",
  "08.00",
  "09.00",
  "10.00",
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
  "17.00",
  "18.00",
  "19.00",
  "20.00",
  "21.00",
  "22.00",
  "23.00",
];

export default function HourlyChart({
  hourlyTemps,
  activeDate,
  onSelectHour,
}: HourlyChartProps) {
  const chartRef = useRef<any>(null);

  const data = {
    labels: LABELS,
    datasets: [
      {
        label: `${activeDate} | temperature: `,
        data: hourlyTemps,
        fill: true,
        color: "#ffffff",
        backgroundColor: "rgba(96, 96, 96, 0.456)",
        borderColor: "#FFEA00",
        tension: 0.5,
        borderWidth: 2.5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: { display: false },
      tooltip: {
        mode: "point",
        intersect: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (context.parsed.y !== null) {
              label += context.parsed.y + " °C";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          maxTicksLimit: 8,
          font: { size: 9 },
        },
        grid: {
          color: "#70707053",
          lineWidth: 0.5,
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          maxTicksLimit: 8,
          stepSize: 4,
          font: { size: 9 },
        },
        grid: {
          color: "#70707053",
          lineWidth: 0.5,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 7,
        hitRadius: 10,
      },
    },
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const elements = getElementAtEvent(chart, event);
    if (elements.length > 0) {
      const hourIndex = elements[0].index;
      onSelectHour(hourIndex);
    }
  };

  return (
    <div className="forecast-hourly box">
      <div className="label">
        <p>Hourly Forecast</p>
      </div>
      <div className="chart-container">
        <Line
          ref={chartRef}
          id="myChart"
          data={data}
          options={options}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
