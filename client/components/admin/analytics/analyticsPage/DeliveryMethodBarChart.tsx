"use client";

import { trpc } from "@/trpc/client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Suspense } from "react";
import { Bar } from "react-chartjs-2";
import { ErrorBoundary } from "react-error-boundary";
import ChartError from "./chartError";
import ChartLoading from "./chartLoading";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const methodColors: Record<string, string> = {
  standard: "#4BC0C0", // teal
  express: "#9966FF", // purple
  pickup: "#FF9F40", // orange
};

const methodLabels: Record<string, string> = {
  standard: "Standard Delivery",
  express: "Express Delivery",
  pickup: "Store Pickup",
};

export const DeliveryMethodBarChart = () => {
  return (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary fallback={<ChartError />}>
        <DeliveryMethodBarChartSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const DeliveryMethodBarChartSuspense = () => {
  const { data, error } =
    trpc.orderAnalyticsRouter.getDeliveryMethodDistribution.useQuery();

  if (error) {
    return <ChartError />;
  }

  // Transform data for ChartJS
  const chartData = {
    labels: data?.map((item) => methodLabels[item.method] || item.method),
    datasets: [
      {
        label: "Number of Orders",
        data: data?.map((item) => item.count),
        backgroundColor: data?.map(
          (item) => methodColors[item.method] || "#999999"
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        Delivery Method Preferences
      </h2>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    return `${value} orders`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};
