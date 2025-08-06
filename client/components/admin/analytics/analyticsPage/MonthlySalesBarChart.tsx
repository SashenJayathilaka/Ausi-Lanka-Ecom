// src/components/MonthlySalesBarChart.tsx
"use client";

import { trpc } from "@/trpc/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FiLoader } from "react-icons/fi";
import { LkrFormat } from "@/utils/format";
import { useState } from "react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const MonthlySalesBarChart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthsToShow, setMonthsToShow] = useState(12);

  const { data, isLoading, error } =
    trpc.orderAnalyticsRouter.getMonthlySales.useQuery({
      year: selectedYear,
      months: monthsToShow,
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-gray-500 text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        Error loading monthly sales data: {error.message}
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data?.map((item) => `${item.month} ${item.year}`) || [],
    datasets: [
      {
        label: "Total Sales",
        data: data?.map((item) => Number(item.totalSales)) || [],
        backgroundColor: "#4BC0C0",
        borderWidth: 1,
      },
      {
        label: "Number of Orders",
        data: data?.map((item) => item.orderCount) || [],
        backgroundColor: "#FFCE56",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Monthly Sales Trend</h2>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={monthsToShow}
            onChange={(e) => setMonthsToShow(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </div>
      </div>
      <div className="h-96">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || "";
                    const value = context.raw as number;
                    return `${label}: ${
                      context.dataset.label?.includes("Sales")
                        ? LkrFormat(value)
                        : value
                    }`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => {
                    if (typeof value === "number" && value >= 1000) {
                      return `LKR ${value / 1000}k`;
                    }
                    return `LKR ${value}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};
