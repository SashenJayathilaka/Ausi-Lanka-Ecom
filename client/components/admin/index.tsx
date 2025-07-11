/* eslint-disable @next/next/no-img-element */
"use client";

import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface OrderDetailsProps {
  orderId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <OrderDetailsContent orderId={orderId} />
      </ErrorBoundary>
    </Suspense>
  );
};

// The main content component
const OrderDetailsContent = ({ orderId }: { orderId: string }) => {
  const [order] = trpc.getItem.getById.useSuspenseQuery({ id: orderId });

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/50 mt-24 mb-24">
      <div className="relative z-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Order #{order.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
            {order.status.toUpperCase()}
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-400">
                Name
              </p>
              <p className="dark:text-white">{order.name}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-400">
                Mobile
              </p>
              <p className="dark:text-white">{order.mobile}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-400">
                Email
              </p>
              <p className="dark:text-white">{order.user?.emailId}</p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-400">
                Address
              </p>
              <p className="dark:text-white">{order.addressLine1}</p>
              {order.addressLine2 && (
                <p className="dark:text-white">{order.addressLine2}</p>
              )}
              <p className="dark:text-white">
                {order.city}, {order.postalCode}
              </p>
              <p className="dark:text-white">{order.district}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-400">
                Delivery Method
              </p>
              <p className="capitalize dark:text-white">
                {order.deliveryMethod}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-400">
                Comments
              </p>
              <p className="dark:text-white">
                {order.comments || "No comments provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Order Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="md:w-1/6 mb-4 md:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto rounded object-contain max-h-32"
                  />
                </div>
                <div className="md:w-4/6 md:pl-6">
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.retailer}
                  </p>
                  <a
                    href={item.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block"
                  >
                    View Product
                  </a>
                </div>
                <div className="md:w-1/6 mt-4 md:mt-0 text-right">
                  <p className="text-gray-700 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    ${item.price}
                  </p>
                  <p className="font-medium dark:text-white">
                    {LkrFormat(Number(item.calculatedPrice))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Order Summary
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold dark:text-white">
              {LkrFormat(Number(order.totalAmount))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
const OrderDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/50 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* Customer Info Skeleton */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Info Skeleton */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Items Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row border border-gray-200 dark:border-gray-700 rounded-lg p-4 gap-4"
          >
            <div className="md:w-1/6 h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="md:w-4/6 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="md:w-1/6 space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};
