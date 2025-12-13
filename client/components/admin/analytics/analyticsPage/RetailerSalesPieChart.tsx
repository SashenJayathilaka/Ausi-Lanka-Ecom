"use client";

import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Suspense } from "react";
import { Pie } from "react-chartjs-2";
import { ErrorBoundary } from "react-error-boundary";
import ChartError from "./chartError";
import ChartLoading from "./chartLoading";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend);

const retailerColors = [
  "#FF6384", // red
  "#36A2EB", // blue
  "#FFCE56", // yellow
  "#4BC0C0", // teal
  "#9966FF", // purple
  "#FF9F40", // orange
  "#8AC24A", // green
  "#FF6B6B", // coral
  "#47B8E0", // light blue
  "#7C4DFF", // deep purple
];

export const RetailerSalesPieChart = () => {
  return (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary fallback={<ChartError />}>
        <RetailerSalesPieChartSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const RetailerSalesPieChartSuspense = () => {
  const { data, error } =
    trpc.orderAnalyticsRouter.getSalesByRetailer.useQuery();
  const { theme } = useTheme();

  if (error) {
    return <ChartError />;
  }

  const topRetailers = data?.slice(0, 5) || [];
  const others = data?.slice(5) || [];

  const othersTotal = others.reduce(
    (sum, retailer) => sum + Number(retailer.totalSales),
    0
  );
  const othersCount = others.reduce(
    (sum, retailer) => sum + retailer.orderCount,
    0
  );

  // Prepare chart data
  const chartData = {
    labels: [
      ...topRetailers.map((r) => r.retailer),
      ...(others.length > 0 ? ["Others"] : []),
    ],
    datasets: [
      {
        data: [
          ...topRetailers.map((r) => Number(r.totalSales)),
          ...(others.length > 0 ? [othersTotal] : []),
        ],
        backgroundColor: [
          ...topRetailers.map(
            (_, i) => retailerColors[i % retailerColors.length]
          ),
          ...(others.length > 0 ? ["#CCCCCC"] : []),
        ],
        borderWidth: 1,
        borderColor: theme === "dark" ? "#1e293b" : "#ffffff",
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow dark:shadow-slate-900 border border-transparent dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
        Sales by Retailer
      </h2>
      <div className="h-64">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  color: theme === "dark" ? "#e5e7eb" : "#374151",
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || "";
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce(
                      (a: number, b: number) => a + b,
                      0
                    );
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${LkrFormat(value)} (${percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Showing top {topRetailers.length} retailers
          {others.length > 0 ? ` + ${others.length} others` : ""}
        </p>
        {others.length > 0 && (
          <p className="mt-1">
            {`"Others" includes ${othersCount} orders worth{" "}
            ${LkrFormat(othersTotal)}`}
          </p>
        )}
      </div>
    </div>
  );
};
