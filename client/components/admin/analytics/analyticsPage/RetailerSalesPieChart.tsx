"use client";

import { trpc } from "@/trpc/client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { FiLoader } from "react-icons/fi";
import { LkrFormat } from "@/utils/format";

// Register ChartJS components
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
  const { data, isLoading, error } =
    trpc.orderAnalyticsRouter.getSalesByRetailer.useQuery();

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
        Error loading retailer data: {error.message}
      </div>
    );
  }

  // Get top 5 retailers (or all if less than 5)
  const topRetailers = data?.slice(0, 5) || [];
  const others = data?.slice(5) || [];

  // Calculate "Others" total if needed
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
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Sales by Retailer</h2>
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
      <div className="mt-4 text-sm text-gray-600">
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
