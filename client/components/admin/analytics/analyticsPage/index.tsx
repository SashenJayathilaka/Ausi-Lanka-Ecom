"use client";

import { trpc } from "@/trpc/client";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Suspense } from "react";
import { Pie } from "react-chartjs-2";
import { ErrorBoundary } from "react-error-boundary";
import ChartError from "./chartError";
import ChartLoading from "./chartLoading";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend);

const statusColors: Record<string, string> = {
  pending: "#FFCE56", // yellow
  confirmed: "#36A2EB", // blue
  shipped: "#FF9F40", // orange
  delivered: "#4BC0C0", // teal
  cancelled: "#FF6384", // red
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const OrderStatusPieChart = () => {
  return (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary fallback={<ChartError />}>
        <OrderStatusPieChartSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const OrderStatusPieChartSuspense = () => {
  const { data, error } =
    trpc.orderAnalyticsRouter.getStatusDistribution.useQuery();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#374151";

  /*   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-gray-500 text-2xl" />
      </div>
    );
  } */

  if (error) {
    return <ChartError />;
  }

  // Transform data for ChartJS
  const chartData = {
    labels: data?.map((item) => statusLabels[item.status] || item.status),
    datasets: [
      {
        data: data?.map((item) => item.count),
        backgroundColor: data?.map(
          (item) => statusColors[item.status] || "#999999"
        ),
        borderWidth: 1,
        borderColor: theme === "dark" ? "#1e293b" : "#ffffff",
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow dark:shadow-slate-900 border border-transparent dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
        Order Status Distribution
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
                  color: textColor,
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || "";
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
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
