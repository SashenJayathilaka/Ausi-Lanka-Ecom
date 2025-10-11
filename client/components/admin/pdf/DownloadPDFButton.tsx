// components/DownloadPDFButton.tsx
"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { pdf } from "@react-pdf/renderer";
import { Order, OrderReceiptPDF } from "./OrderReceiptPDF";

interface DownloadPDFButtonProps {
  order: Order;
  className?: string;
}

export const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  order,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = async () => {
    setIsLoading(true);
    try {
      // Generate PDF on client side
      const blob = await pdf(<OrderReceiptPDF order={order} />).toBlob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `order-receipt-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer
        hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed 
        transition-colors duration-200 ${className}
      `}
    >
      <FiDownload className="w-4 h-4" />
      {isLoading ? "Generating PDF..." : "Download Receipt"}
    </button>
  );
};
