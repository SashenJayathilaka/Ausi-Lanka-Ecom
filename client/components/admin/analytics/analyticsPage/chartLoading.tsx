import React from "react";
import { FiLoader } from "react-icons/fi";

const ChartLoading = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <FiLoader className="animate-spin text-gray-500 text-2xl" />
    </div>
  );
};

export default ChartLoading;
