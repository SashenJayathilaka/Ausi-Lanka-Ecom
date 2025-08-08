"use client";

import { districts } from "@/lib/districts";
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

export const DistrictSalesBarChart = () => {
  return (
    <Suspense fallback={<ChartLoading />}>
      <ErrorBoundary fallback={<ChartError />}>
        <DistrictSalesBarChartSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const DistrictSalesBarChartSuspense = () => {
  const { data, error } =
    trpc.orderAnalyticsRouter.getSalesByDistrict.useQuery();

  if (error) {
    return <ChartError />;
  }

  // Create a map of all districts with default values
  const districtMap = new Map<string, { sales: number; count: number }>();

  // Initialize all districts with zero values
  districts.forEach((district) => {
    districtMap.set(district, { sales: 0, count: 0 });
  });

  // Update with actual data
  data?.forEach((item) => {
    districtMap.set(item.district, {
      sales: Number(item.totalSales),
      count: item.orderCount,
    });
  });

  // Sort districts by sales (descending)
  const sortedDistricts = [...districtMap.entries()]
    .sort((a, b) => b[1].sales - a[1].sales)
    .map(([district]) => district);

  // Get top 10 districts for better readability
  const displayDistricts = sortedDistricts.slice(0, 10);
  const displayData = displayDistricts.map(
    (district) => districtMap.get(district)!
  );

  // Prepare chart data
  const chartData = {
    labels: displayDistricts,
    datasets: [
      {
        label: "Total Sales (LKR)",
        data: displayData.map((item) => item.sales),
        backgroundColor: "#36A2EB",
        borderWidth: 1,
      },
      {
        label: "Number of Orders",
        data: displayData.map((item) => item.count),
        backgroundColor: "#FFCE56",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Top 10 Districts by Sales</h2>
      <div className="h-96">
        {" "}
        {/* Taller container for better visibility */}
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
              x: {
                ticks: {
                  autoSkip: false,
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Showing top 10 of {districts.length} districts
      </p>
    </div>
  );
};
