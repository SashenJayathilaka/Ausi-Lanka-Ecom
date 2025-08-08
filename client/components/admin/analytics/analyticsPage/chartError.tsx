import React from "react";

type Props = {
  message?: string;
};

const ChartError = ({ message }: Props) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 text-red-800 p-4 rounded-lg">
        {message || "An error occurred while loading the chart."}
      </div>
    </div>
  );
};

export default ChartError;
