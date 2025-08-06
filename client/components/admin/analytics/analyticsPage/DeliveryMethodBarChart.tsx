// src/components/DeliveryMethodBarChart.tsx
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
  const { data, isLoading, error } =
    trpc.orderAnalyticsRouter.getDeliveryMethodDistribution.useQuery();

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
        Error loading delivery method data: {error.message}
      </div>
    );
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
