"use client";

import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FiAlertTriangle, FiLock, FiPackage } from "react-icons/fi";
import { DownloadPDFButton } from "./pdf/DownloadPDFButton";

interface OrderDetailsProps {
  orderId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <ErrorBoundary
        FallbackComponent={OrderErrorFallback}
        onReset={() => window.location.reload()}
      >
        <OrderDetailsContent orderId={orderId} />
      </ErrorBoundary>
    </Suspense>
  );
};

// The main content component
const OrderDetailsContent = ({ orderId }: { orderId: string }) => {
  const [order] = trpc.getItem.getById.useSuspenseQuery({ id: orderId });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 bg-white rounded-lg shadow-md mt-20 sm:mt-24 mb-20 sm:mb-24">
      <div className="relative z-0">
        {/* Updated Header with Mobile-Responsive Download Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Order #{order.id}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-2 sm:py-1 rounded-full text-xs sm:text-sm font-medium text-center">
              {order.status.toUpperCase()}
            </div>
            {/* Download Button - Full width on mobile, auto on desktop */}
            <div className="w-full sm:w-auto">
              <DownloadPDFButton
                order={order}
                className="w-full sm:w-auto justify-center"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 underline">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Name
              </p>
              <p className="font-semibold text-sm sm:text-base mt-1">
                {order.name}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Mobile
              </p>
              <p className="font-semibold text-sm sm:text-base mt-1">
                {order.mobile}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Email
              </p>
              <p className="font-semibold text-sm sm:text-base mt-1">
                {order.user?.emailId}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 underline">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <p className="font-medium text-gray-700 text-sm sm:text-base mb-2">
                Address
              </p>
              <div className="space-y-1">
                <p className="font-semibold text-sm sm:text-base">
                  {order.addressLine1}
                </p>
                {order.addressLine2 && (
                  <p className="font-semibold text-sm sm:text-base">
                    {order.addressLine2}
                  </p>
                )}
                <p className="font-semibold text-sm sm:text-base">
                  {order.city}, {order.postalCode}
                </p>
                <p className="font-semibold text-sm sm:text-base">
                  {order.district}
                </p>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Delivery Method
              </p>
              <p className="capitalize font-semibold text-sm sm:text-base mt-1">
                {order.deliveryMethod}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Comments
              </p>
              <p className="font-semibold text-sm sm:text-base mt-1">
                {order.comments || "No comments provided"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Missing Items
              </p>
              <p className="font-semibold text-sm sm:text-base mt-1">
                {order.missingItems || "No missing items"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Order Items ({order.items.length})
            </h2>
          </div>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row border border-gray-200 rounded-lg p-4 sm:p-6"
              >
                <div className="md:w-1/6 mb-4 md:mb-0 flex justify-center md:justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-full md:h-auto rounded object-contain"
                  />
                </div>
                <div className="md:w-4/6 md:pl-6">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {item.retailer}
                  </p>
                  <a
                    href={item.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs sm:text-sm hover:underline mt-2 inline-block"
                  >
                    View Product
                  </a>
                </div>
                <div className="md:w-1/6 mt-4 md:mt-0 text-right">
                  <p className="text-gray-700 text-sm sm:text-base">
                    Qty:{" "}
                    <span className="text-red-400 font-semibold">
                      {item.quantity}
                    </span>
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base mt-1">
                    ${item.price}
                  </p>
                  <p className="font-semibold text-sm sm:text-base mt-1">
                    {LkrFormat(Number(item.calculatedPrice))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Order Summary
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-700 text-sm sm:text-base">Total Amount</p>
            <p className="text-xl sm:text-2xl font-bold">
              {LkrFormat(Number(order.totalAmount))}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Download Button for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
        <DownloadPDFButton
          order={order}
          className="w-full justify-center py-3"
        />
      </div>
    </div>
  );
};

export default OrderDetails;

const OrderDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md animate-pulse mt-20 sm:mt-24 mb-20 sm:mb-24">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2 flex-1">
          <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 sm:w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="h-6 w-20 bg-gray-200 rounded-full self-center sm:self-auto"></div>
          <div className="h-12 sm:h-10 w-full sm:w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Customer Info Skeleton */}
      <div className="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Shipping Info Skeleton */}
      <div className="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Items Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row border border-gray-200 rounded-lg p-4 sm:p-6 gap-4"
          >
            <div className="md:w-1/6 h-32 sm:h-40 bg-gray-200 rounded self-center md:self-auto"></div>
            <div className="md:w-4/6 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="md:w-1/6 space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
              <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
              <div className="h-5 w-20 bg-gray-200 rounded ml-auto"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Mobile Sticky Button Skeleton */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="h-12 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const OrderErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const router = useRouter();
  const isAdminError = error.message.includes("Only admin users");
  const isNotFound = error.message.includes("Order not found");

  return (
    <div className="max-w-md mx-auto p-6 text-center mt-20 sm:mt-24">
      <div className="flex flex-col items-center space-y-4">
        {isAdminError ? (
          <FiLock className="w-12 h-12 text-red-500" />
        ) : isNotFound ? (
          <FiPackage className="w-12 h-12 text-yellow-500" />
        ) : (
          <FiAlertTriangle className="w-12 h-12 text-blue-500" />
        )}

        <h2 className="text-xl font-semibold">
          {isAdminError
            ? "Admin Access Required"
            : isNotFound
              ? "Order Not Found"
              : "Something Went Wrong"}
        </h2>

        <p className="text-gray-600">{error.message}</p>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm sm:text-base"
          >
            Home
          </button>
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
