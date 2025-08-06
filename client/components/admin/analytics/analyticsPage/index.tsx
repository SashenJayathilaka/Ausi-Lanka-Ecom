"use client";

import { trpc } from "@/trpc/client";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { FiLoader } from "react-icons/fi";

// Register ChartJS components
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
  const { data, isLoading, error } =
    trpc.orderAnalyticsRouter.getStatusDistribution.useQuery();

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
        Error loading order status data: {error.message}
      </div>
    );
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
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
      <div className="h-64">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
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
