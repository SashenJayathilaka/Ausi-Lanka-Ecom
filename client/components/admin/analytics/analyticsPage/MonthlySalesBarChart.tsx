"use client";

import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Suspense, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ErrorBoundary } from "react-error-boundary";
import ChartError from "./chartError";
import ChartLoading from "./chartLoading";
import { useTheme } from "next-themes";

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
  return (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary fallback={<ChartError />}>
        <MonthlySalesBarChartSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const MonthlySalesBarChartSuspense = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthsToShow, setMonthsToShow] = useState(12);

  const { data, error } = trpc.orderAnalyticsRouter.getMonthlySales.useQuery({
    year: selectedYear,
    months: monthsToShow,
  });

  if (error) {
    return (
      <ChartError
        message={`Error loading monthly sales data: ${error.message}`}
      />
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
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow dark:shadow-slate-900 border border-transparent dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-gray-100">
          Monthly Sales Trend
        </h2>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-gray-100"
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
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-gray-100"
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
                labels: {
                  color: theme === "dark" ? "#e5e7eb" : "#374151",
                },
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
                  color: theme === "dark" ? "#e5e7eb" : "#374151",
                },
                grid: {
                  color: theme === "dark" ? "#374151" : "#e5e7eb",
                },
              },
              x: {
                ticks: {
                  color: theme === "dark" ? "#e5e7eb" : "#374151",
                },
                grid: {
                  color: theme === "dark" ? "#374151" : "#e5e7eb",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};
